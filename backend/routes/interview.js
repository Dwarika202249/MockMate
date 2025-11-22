const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const interviewController = require('../controllers/interviewController');

// Create/Start interview (POST /api/interview/start)
router.post("/start", userAuth, interviewController.startInterview);

// Create interview (POST /api/interview/)
router.post("/", userAuth, interviewController.createInterview);

// IMPORTANT: Define specific routes BEFORE generic :id routes
// Get interview history (GET /api/interview/history)
router.get("/history", userAuth, interviewController.getInterviewHistory);

// Submit interview answers (POST /api/interview/submit)
router.post("/submit", userAuth, interviewController.submitInterview);

// Get interview by ID (GET /api/interview/:id) - MUST be after /history
router.get("/:id", userAuth, interviewController.getInterview);

// Update interview preferences (PUT /api/interview/:id/preferences)
router.put("/:id/preferences", userAuth, interviewController.updateInterviewPreferences);

// Get interview details (GET /api/interview/:interviewId/details)
router.get("/:interviewId/details", userAuth, interviewController.getInterviewDetails);

// Cancel interview (DELETE /api/interview/:interviewId/cancel)
router.delete("/:interviewId/cancel", userAuth, interviewController.cancelInterview);

// Delete interview (DELETE /api/interview/:interviewId/delete)
router.delete("/:interviewId/delete", userAuth, interviewController.deleteInterview);

module.exports = router;
