const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const quizController = require('../controllers/quizController');

// Public list/get
router.get('/', quizController.listQuizzes);
router.get('/featured', quizController.listFeaturedTechs);
router.get('/:id', quizController.getQuiz);
// Get last attempt for current user on a quiz
router.get('/:id/last-attempt', userAuth, quizController.getLastAttempt);

// List active attempts for current user
router.get('/attempts/active', userAuth, quizController.listActiveAttempts);

// Start quiz (authenticated)
router.post('/:id/start', userAuth, quizController.startQuiz);
// Submit quiz
router.post('/:id/submit', userAuth, quizController.submitQuiz);
// Cancel attempt (release reserved credits)
router.post('/:id/attempt/:attemptId/cancel', userAuth, quizController.cancelAttempt);

// Admin/internal: generate quiz via AI (rate-limited, logged)
const adminRateLimiter = require('../middleware/adminRateLimiter');
router.post('/generate', adminRateLimiter, quizController.generateQuiz);

// Admin operations
const adminController = require('../controllers/adminController');
router.post('/:id/publish', adminController.publishQuiz);
router.get('/admin/reservations', adminController.listReservations);

module.exports = router;
