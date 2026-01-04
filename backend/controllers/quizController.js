const Quiz = require('../models/QuizSchema');
const Attempt = require('../models/QuizAttemptSchema');
const mongoose = require('mongoose');
const { reserveCreditsForQuiz, commitReservedCredits, releaseReservedCredits } = require('../utils/creditManager');

// List quizzes with basic filtering
exports.listQuizzes = async (req, res) => {
  try {
    const { search, tags, difficulty, isPremium, page = 1, limit = 20, includeDrafts } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (tags) query.techTags = { $in: Array.isArray(tags) ? tags : tags.split(',') };
    if (difficulty) query.difficulty = difficulty;
    if (typeof isPremium !== 'undefined') query.isPremium = (isPremium === 'true' || isPremium === true);

    // By default only show published quizzes
    if (!includeDrafts || includeDrafts === 'false') {
      query.isPublished = true;
    } else {
      // Only allow includeDrafts if Admin API key provided
      const adminKey = req.headers['x-admin-api-key'];
      if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
        // strip draft inclusion
        query.isPublished = true;
      }
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [quizzes, total] = await Promise.all([
      Quiz.find(query).skip(skip).limit(limitNum).lean(),
      Quiz.countDocuments(query)
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    res.json({ quizzes, pagination: { total, totalPages, page: pageNum } });
  } catch (err) {
    console.error('Error listing quizzes:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json({ quiz });
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/quizzes/:id/last-attempt - get current user's latest attempt for this quiz
exports.getLastAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.id;
    const attempt = await Attempt.findOne({ quiz: quizId, user: userId, completed: true }).sort({ endedAt: -1 }).lean();
    // Return a safe 200 payload with `attempt: null` when there is no previous attempt to avoid noisy 404s on the client
    if (!attempt) return res.json({ attempt: null });
    res.json({ attempt });
  } catch (err) {
    console.error('Error fetching last attempt:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// List active (incomplete) attempts for the current user
exports.listActiveAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await Attempt.find({ user: userId, completed: false }).sort({ startedAt: -1 }).lean();
    // populate quiz title via lookup
    const Quiz = require('../models/QuizSchema');
    const quizIds = [...new Set(attempts.map(a => String(a.quiz)))];
    const quizzes = await Quiz.find({ _id: { $in: quizIds } }).lean();
    const quizMap = quizzes.reduce((acc, q) => { acc[String(q._id)] = q; return acc; }, {});
    const enriched = attempts.map(a => ({ ...a, quizTitle: quizMap[String(a.quiz)]?.title || '' }));
    res.json({ attempts: enriched });
  } catch (err) {
    console.error('Error listing active attempts:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Start quiz: creates an attempt and reserves credits if premium
exports.startQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    // If premium, reserve credits
    let reservation = null;
    if (quiz.isPremium && quiz.creditCost > 0) {
      reservation = await reserveCreditsForQuiz(userId, quizId, quiz.creditCost);
      if (!reservation || !reservation.success) {
        return res.status(402).json({ msg: 'Insufficient credits to start this quiz' });
      }
    }

    // Create attempt
    const attempt = await Attempt.create({
      user: userId,
      quiz: quizId,
      startedAt: new Date(),
      reservedCreditsId: reservation ? reservation.id : null
    });

    res.json({ attemptId: attempt._id, timeLimitSecs: quiz.timeLimitSecs });
  } catch (err) {
    console.error('Error starting quiz:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin/internal: generate a quiz using AI and persist it (returns created quiz)
exports.generateQuiz = async (req, res) => {
  try {
    // Protect with ADMIN_API_KEY header or env var
    const adminKey = req.headers['x-admin-api-key'];
    if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { title, tech, difficulty = 'hard', numQuestions = 5, creditCost = 10, description = '' } = req.body;

    if (!title || !tech) return res.status(400).json({ msg: 'title and tech are required' });

    // Use AI provider to generate MCQs
    const { generateQuizWithFailover } = require('../utils/aiProvider');
    const generated = await generateQuizWithFailover({ tech, numQuestions, difficulty });

    if (!generated || !Array.isArray(generated) || generated.length === 0) {
      return res.status(500).json({ msg: 'Failed to generate quiz content' });
    }

    const quizDoc = new Quiz({
      title,
      description,
      techTags: [tech],
      difficulty,
      isPremium: true,
      creditCost,
      questions: generated,
      isPublished: false
    });

    await quizDoc.save();

    // Log the generation event
    try {
      const AiGenerationLog = require('../models/AiGenerationLog');
      await AiGenerationLog.create({
        adminKeyMasked: req.rateLimitInfo?.adminKeyMasked || '',
        tech,
        numQuestions,
        difficulty,
        creditCost,
        success: true,
        quizId: quizDoc._id
      });
    } catch (logErr) {
      console.warn('Failed to write AI generation log:', logErr.message);
    }

    console.info(`AI quiz generated by ${req.rateLimitInfo?.adminKeyMasked || 'unknown'}: ${title} (${tech})`);
    res.status(201).json({ quiz: quizDoc });
  } catch (err) {
    console.error('Error generating quiz:', err);

    // Log failure
    try {
      const AiGenerationLog = require('../models/AiGenerationLog');
      await AiGenerationLog.create({
        adminKeyMasked: req.rateLimitInfo?.adminKeyMasked || '',
        tech: req.body.tech || '',
        numQuestions: req.body.numQuestions || 0,
        difficulty: req.body.difficulty || '',
        creditCost: req.body.creditCost || 0,
        success: false,
        errorMessage: err.message
      });
    } catch (logErr) {
      console.warn('Failed to write AI generation error log:', logErr.message);
    }

    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/quizzes/featured - return top tech tags by quiz count
exports.listFeaturedTechs = async (req, res) => {
  try {
    // Aggregate top techTags
    const agg = await Quiz.aggregate([
      { $unwind: '$techTags' },
      { $group: { _id: '$techTags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 },
      { $project: { tech: '$_id', count: 1, _id: 0 } }
    ]);
    res.json({ featured: agg.map(a => a.tech) });
  } catch (err) {
    console.error('Error fetching featured techs:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Grading helper (simplified per-request)
// - Each question is worth 1 mark by default
// - Single-choice: correct -> 1, else 0
// - Multi-choice: exact match -> 1, partially correct -> 0.5, else 0
function gradeQuestion(question, submittedChoiceIds) {
  const correctChoices = (question.choices || []).filter(c => c.isCorrect).map(c => c.id);
  const selected = Array.isArray(submittedChoiceIds) ? submittedChoiceIds : [];

  if (question.scoringType === 'single') {
    const got = selected[0] || null;
    return { score: (got && correctChoices.includes(got)) ? 1 : 0 };
  } else {
    // multi-choice: simple partial scoring
    if (selected.length === 0) return { score: 0 };
    const correctSelected = selected.filter(s => correctChoices.includes(s)).length;
    const totalCorrect = correctChoices.length;
    // exact match
    if (correctSelected === totalCorrect && selected.length === totalCorrect) return { score: 1 };
    // partially correct (some correct selected, but not all)
    if (correctSelected > 0) return { score: 0.5 };
    return { score: 0 };
  }
}

// Submit attempt
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { attemptId, answers } = req.body; // answers: [{ questionId, selectedChoiceIds }]

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ msg: 'Attempt not found' });
    if (String(attempt.user) !== userId) return res.status(403).json({ msg: 'Forbidden' });

    const quiz = await Quiz.findById(attempt.quiz).lean();
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    // Grade — include all questions so skipped ones are recorded as zero
    const answersMap = (answers || []).reduce((acc, a) => { acc[a.questionId] = a.selectedChoiceIds || []; return acc; }, {});
    const perQuestionResults = (quiz.questions || []).map(q => {
      const submitted = answersMap[q.id] || [];
      const graded = gradeQuestion(q, submitted);
      // Each question counts as 1 mark; partial is 0.5
      return {
        questionId: q.id,
        score: graded.score,
        maxPoints: 1,
        selected: submitted
      };
    });

    const totalScore = perQuestionResults.reduce((s, r) => s + (r.score || 0), 0);
    const totalMax = (quiz.questions || []).length;

    // Save attempt result
    attempt.endedAt = new Date();
    attempt.answers = perQuestionResults;
    attempt.totalScore = Math.round(totalScore * 100) / 100;
    attempt.totalMax = totalMax;
    attempt.completed = true;
    await attempt.save();

    // Commit reserved credits if any
    if (attempt.reservedCreditsId) {
      await commitReservedCredits(attempt.reservedCreditsId);
    }

    res.json({ totalScore: attempt.totalScore, totalMax: attempt.totalMax, perQuestionResults });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Cancel attempt and release reserved credits (if any)
exports.cancelAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: quizId, attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ msg: 'Attempt not found' });
    if (String(attempt.user) !== userId) return res.status(403).json({ msg: 'Forbidden' });
    if (String(attempt.quiz) !== String(quizId)) return res.status(400).json({ msg: 'Mismatched quiz' });

    if (attempt.reservedCreditsId) {
      try {
        await releaseReservedCredits(attempt.reservedCreditsId);
      } catch (err) {
        console.warn('Failed to release reservation:', err.message);
      }
    }

    // Mark attempt as completed/abandoned
    attempt.completed = true;
    attempt.endedAt = new Date();
    await attempt.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error cancelling attempt:', err);
    res.status(500).json({ msg: 'Server error' });
  }
}
