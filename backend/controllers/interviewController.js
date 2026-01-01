const Interview = require('../models/InterviewSchema');
const Resume = require('../models/ResumeSchema');
const FeedbackSummary = require('../models/FeedbackSchema');
const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');
const { queues } = require('../config/queue');

// Start a new interview session (supports resume-based and free interviews)
exports.startInterview = async (req, res) => {
  try {
    const { resumeId, preferences, type, details, numQuestions, difficulty } = req.body;

    // Ensure authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    // Resume-based interview (existing flow)
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      const interview = new Interview({
        user: userId,
        resume: resumeId,
        preferences: preferences || {},
        status: 'created',
        startTime: new Date()
      });

      await interview.save();

      // Queue question generation job
      await queues.questionGeneration.add({
        interviewId: interview._id,
        resumeText: resume.summary,
        role: resume.jobRole,
        numQuestions: 5
      });

      return res.status(201).json({
        status: 'success',
        interviewId: interview._id,
        interview
      });
    }

    // Free interview flow (no resumeId)
    if (!details && !type) {
      return res.status(400).json({ message: 'Missing interview details or type for free interview' });
    }

    // Map difficulty values to schema enums: basic->easy, intermediate->medium, advanced->hard
    const difficultyMap = (d) => {
      if (!d) return 'easy';
      const dd = d.toString().toLowerCase();
      if (dd === 'basic') return 'easy';
      if (dd === 'intermediate') return 'medium';
      if (dd === 'advanced') return 'hard';
      if (['easy','medium','hard'].includes(dd)) return dd;
      return 'easy';
    };

    const mappedDifficulty = difficultyMap(difficulty || preferences?.difficulty);

    const interview = new Interview({
      user: userId,
      // Do not set `resume` for free interviews
      type: 'free',
      details: details || type || '',
      preferences: {
        ...(preferences || {}),
        difficulty: mappedDifficulty,
        numQuestions: numQuestions || 5,
        interviewStyle: preferences?.interviewStyle || 'standard' // keep an allowed enum value
      },
      status: 'created',
      startTime: new Date()
    });

    await interview.save();

    // Queue question generation job using provided details as context
    await queues.questionGeneration.add({
      interviewId: interview._id,
      resumeText: details || type || '',
      role: type || details || 'General',
      numQuestions: numQuestions || 5
    });

    res.status(201).json({
      status: 'success',
      interviewId: interview._id,
      interview
    });
  } catch (error) {
    console.error('Error starting interview:', error.message, error.stack || error);
    const response = { message: 'Failed to start interview' };
    if (process.env.NODE_ENV !== 'production') response.error = error.message;
    res.status(500).json(response);
  }
};

// Create interview (backward compatibility)
exports.createInterview = async (req, res) => {
  try {
    const { resumeId, preferences } = req.body;
    const userId = req.user.id;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const interview = new Interview({
      user: userId,
      resume: resumeId,
      preferences: preferences || {},
      status: 'created'
    });

    await interview.save();
    res.status(201).json({ status: 'success', interview });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: 'Failed to create interview' });
  }
};

// Get interview by ID
exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('resume')
      .populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ status: 'success', interview });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({ message: 'Failed to fetch interview' });
  }
};

// Update interview preferences
exports.updateInterviewPreferences = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Update request - ID:', id, 'Body:', JSON.stringify(req.body));

    // Validate that ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid interview ID format' });
    }

    // Extract status and top-level fields if present
    const { status, userIntroductionProvided, currentQuestionIndex, ...incomingData } = req.body;

    // Build the update object
    const updateObj = {};

    // Add top-level persistence fields
    if (userIntroductionProvided !== undefined) {
      updateObj.userIntroductionProvided = userIntroductionProvided;
      console.log('✅ Will update userIntroductionProvided to:', userIntroductionProvided);
    }

    if (currentQuestionIndex !== undefined) {
      updateObj.currentQuestionIndex = currentQuestionIndex;
      console.log('✅ Will update currentQuestionIndex to:', currentQuestionIndex);
    }

    // Build the preferences update object, filtering out any non-preference fields
    const preferenceFields = [
      'interviewStyle',
      'difficulty',
      'duration',
      'focusAreas',
      'communicationStyle',
      'interviewerPersonality'
    ];

    const preferencesUpdate = {};
    preferenceFields.forEach(field => {
      if (field in incomingData) {
        preferencesUpdate[field] = incomingData[field];
      }
    });

    // Only add preferences to update if there are fields to update
    if (Object.keys(preferencesUpdate).length > 0) {
      updateObj.preferences = preferencesUpdate;
      console.log('✅ Will update preferences:', preferencesUpdate);
    }

    // Add status to update object
    if (status) {
      updateObj.status = status;
      if (status === 'active') {
        updateObj.startTime = new Date();
      }
      if (status === 'completed') {
        updateObj.endTime = new Date();
      }
      console.log('✅ Will update status to:', status);
    }

    console.log('📝 Update object:', JSON.stringify(updateObj));

    // Use findByIdAndUpdate for atomic operation
    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: false } // new: true returns updated doc, runValidators: false prevents validation issues
    ).populate('resume').populate('user', 'name email');

    if (!updatedInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    console.log('✅ Interview updated successfully:', { id: updatedInterview._id, status: updatedInterview.status });
    res.json({ status: 'success', interview: updatedInterview });
  } catch (error) {
    console.error('❌ Error updating preferences:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
};

// Submit interview (supports quick free interview submissions)
exports.submitInterview = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;
    const userId = req.user.id;

    if (!interviewId) {
      return res.status(400).json({ message: 'Missing interviewId' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // If no questions were generated, return an error
    if (!Array.isArray(interview.questions) || interview.questions.length === 0) {
      return res.status(400).json({ message: 'No questions available for this interview yet' });
    }

    // Local quick evaluation for each answer
    const perQuestionFeedback = [];
    let totalScore = 0;

    // Lazy import to avoid circulars during startup
    const { calculateAnswerScore } = require('../utils/localEvaluator');

    interview.questions.forEach((q, idx) => {
      const ans = (answers && answers[idx]) || answers?.[idx]?.trim() || '';
      const expectedKeywords = q.expectedKeywords || [];
      const evalRes = calculateAnswerScore(ans, expectedKeywords);

      perQuestionFeedback.push({
        questionId: q.id || `q-${idx}`,
        question: q.text,
        answer: ans,
        score: evalRes.score,
        feedback: evalRes.feedback,
        metrics: evalRes.metrics
      });

      totalScore += evalRes.score;
    });

    const averageScore = Math.round(totalScore / interview.questions.length);

    // Save quick feedback document
    const feedbackDoc = new FeedbackSummary({
      interviewId: interview._id,
      questions: interview.questions.map((q) => q.text || ''),
      answers: interview.questions.map((q, i) => (answers && answers[i]) || ''),
      feedback: `Quick score: ${averageScore}. Basic feedback generated.`,
      user: userId
    });

    await feedbackDoc.save();

    // Update interview status and summary
    interview.status = 'completed';
    interview.endTime = new Date();
    interview.summary = {
      type: 'quick',
      averageScore,
      perQuestionFeedback
    };

    await interview.save();

    res.json({
      status: 'success',
      feedback: {
        averageScore,
        perQuestionFeedback
      },
      feedbackId: feedbackDoc._id
    });
  } catch (error) {
    console.error('Error submitting interview:', error);
    res.status(500).json({ message: 'Failed to submit interview' });
  }
};

// Get interview history with pagination
exports.getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`📋 Fetching interview history for user ${userId} - Page: ${page}, Limit: ${limit}`);

    // Get total count for pagination
    const total = await Interview.countDocuments({ user: userId });

    // Fetch paginated interviews
    const interviews = await Interview.find({ user: userId })
      .populate('resume', 'jobRole')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`✅ Found ${interviews.length} interviews (Total: ${total})`);

    res.json({
      status: 'success',
      interviews,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// Get interview details
exports.getInterviewDetails = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId)
      .populate('resume')
      .populate('user', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ status: 'success', interview });
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ message: 'Failed to fetch details' });
  }
};

// Cancel interview
exports.cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'cancelled';
    interview.endTime = new Date();
    await interview.save();

    res.json({ status: 'success', message: 'Interview cancelled', interview });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    res.status(500).json({ message: 'Failed to cancel interview' });
  }
};

// Delete interview
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ status: 'success', message: 'Interview deleted' });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ message: 'Failed to delete interview' });
  }
};

// Save conversation message (for session persistence)
exports.saveMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, text, timestamp } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!sender || !text) {
      return res.status(400).json({ message: 'Missing sender or text' });
    }

    if (!['ai', 'user'].includes(sender)) {
      return res.status(400).json({ message: 'Invalid sender type' });
    }

    // Find interview and verify ownership
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create message object
    const message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      text,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      messageType: sender === 'ai' ? 'message' : 'answer'
    };

    // Add message to conversation array
    if (!interview.conversation) {
      interview.conversation = [];
    }
    
    interview.conversation.push(message);

    // Save interview
    await interview.save();

    res.status(200).json({
      status: 'success',
      message: 'Message saved'
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to save message' });
  }
};

// Helper functions for Gemini integration (used by websocket handlers and workers)
exports.generateQuestionsWithGemini = async (resumeContext, preferences) => {
  try {
    // Use new AI provider with 2-tier failover: Groq -> Pre-stored Dataset
    const questions = await generateQuestionsWithFailover(
      resumeContext.summary || '',
      resumeContext.jobRole || 'Software Engineer',
      5
    );
    return questions;
  } catch (error) {
    console.error('Error generating questions with failover:', error);
    throw error;
  }
};

exports.evaluateAnswerWithGemini = async (answer, question, preferences) => {
  try {
    // Use new AI provider with 3-tier failover for evaluation
    const evaluation = await evaluateAnswerWithFailover(
      question,
      answer.text || answer,
      { difficulty: preferences?.difficulty || 'medium' }
    );
    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer with failover:', error);
    throw error;
  }
};

exports.generateInterviewSummary = async (interview) => {
  try {
    const summary = await generateSummaryWithFailover({
      questions: interview.questions,
      answers: interview.answers,
      duration: interview.endTime ? (interview.endTime - interview.startTime) / 1000 : 0
    });
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
