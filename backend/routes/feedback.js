const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const feedbackController = require('../controllers/feedbackController');

// Get feedback for an interview (GET /api/feedback/:interviewId)
router.get('/:interviewId', userAuth, feedbackController.getFeedbackByInterviewId);

// Create feedback (POST /api/feedback)
router.post('/', userAuth, feedbackController.createFeedback);

// Update feedback (PATCH /api/feedback/:id)
router.patch('/:id', userAuth, feedbackController.updateFeedback);

// Get feedback by id (GET /api/feedback/id/:id)
router.get('/id/:id', userAuth, feedbackController.getFeedbackById);

module.exports = router;