const express = require('express');
const router = express.Router();
const creditsController = require('../controllers/creditsController');
const auth = require('../middleware/userAuth');

// Get user's credit balance and events
router.get('/', auth, creditsController.getCredits);

// Check if user has enough credits
router.get('/check', auth, creditsController.checkCredits);

// Consume credits (internal use by interview system)
router.post('/consume', auth, creditsController.consumeCredits);

// Purchase credits (called by Stripe webhook or purchase flow)
router.post('/purchase', auth, creditsController.purchaseCredits);

// Create Stripe Checkout Session (client uses this to redirect to Stripe)
router.post('/checkout', auth, creditsController.createCheckoutSession);

// Grant credits (admin/system)
router.post('/grant', auth, creditsController.grantCredits);

module.exports = router;
