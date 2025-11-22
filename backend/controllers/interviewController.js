const Interview = require('../models/InterviewSchema');
const Resume = require('../models/ResumeSchema');
const FeedbackSummary = require('../models/FeedbackSchema');
const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');
const { queues } = require('../config/queue');

// Start a new interview session
exports.startInterview = async (req, res) => {
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
      status: 'initialized',
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

    res.status(201).json({
      status: 'success',
      interview
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ message: 'Failed to start interview' });
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

    // Extract status if present
    const { status, ...incomingData } = req.body;

    // Build the update object
    const updateObj = {};

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

// Submit interview (deprecated; use websocket instead)
exports.submitInterview = async (req, res) => {
  res.json({ message: 'Use WebSocket for real-time interview' });
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
