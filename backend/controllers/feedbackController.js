const Feedback = require('../models/FeedbackSchema');
const Interview = require('../models/InterviewSchema');

// GET /api/feedback/:interviewId - get feedback for an interview
exports.getFeedbackByInterviewId = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Validate interview ownership
    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ msg: 'Interview not found' });
    if (String(interview.user) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const feedback = await Feedback.findOne({ interviewId }).lean();
    if (!feedback) return res.status(404).json({ msg: 'Feedback not found' });

    res.json({ feedback });
  } catch (err) {
    console.error('Error in getFeedbackByInterviewId:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/feedback - create feedback (idempotent - returns existing if present)
exports.createFeedback = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.interviewId) return res.status(400).json({ msg: 'interviewId is required' });

    // Verify interview exists and belongs to user
    const interview = await Interview.findById(payload.interviewId);
    if (!interview) return res.status(404).json({ msg: 'Interview not found' });
    if (String(interview.user) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    // If feedback already exists, return it (idempotent behaviour)
    let existing = await Feedback.findOne({ interviewId: payload.interviewId, user: req.user.id });
    if (existing) return res.status(200).json({ feedback: existing, msg: 'Feedback already exists' });

    const feedbackDoc = new Feedback({
      interviewId: payload.interviewId,
      user: req.user.id,
      source: payload.source || 'ai',
      questions: payload.questions || [],
      answers: payload.answers || [],
      summary: payload.summary || {},
      legacy: payload.legacy || {},
    });

    await feedbackDoc.save();

    res.status(201).json({ feedback: feedbackDoc });
  } catch (err) {
    console.error('Error in createFeedback:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// PATCH /api/feedback/:id - update feedback partially
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ msg: 'Feedback not found' });

    if (String(feedback.user) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    // Only allow specific fields to be updated
    const allowed = ['questions', 'answers', 'summary', 'source', 'version', 'legacy'];
    allowed.forEach((field) => {
      if (field in payload) feedback[field] = payload[field];
    });

    await feedback.save();

    res.json({ feedback });
  } catch (err) {
    console.error('Error in updateFeedback:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Optional helper: get by feedback id
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id).lean();
    if (!feedback) return res.status(404).json({ msg: 'Feedback not found' });
    if (String(feedback.user) !== String(req.user.id)) return res.status(403).json({ msg: 'Forbidden' });
    res.json({ feedback });
  } catch (err) {
    console.error('Error in getFeedbackById:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};