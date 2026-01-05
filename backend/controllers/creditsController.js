const User = require('../models/User');
const CreditEvent = require('../models/CreditEventSchema');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

// Define pack catalog server-side to prevent client manipulation
const CREDIT_PACKS = {
  basic: { id: 'basic', credits: 100, price_cents: 500 },
  pro: { id: 'pro', credits: 250, price_cents: 1000 },
  premium: { id: 'premium', credits: 500, price_cents: 1800 }
};

// Get user's credit balance and recent events
exports.getCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('credits creditsGrantedAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent credit events (last 20)
    const events = await CreditEvent.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-user');

    res.json({
      balance: user.credits,
      grantedAt: user.creditsGrantedAt,
      events
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Consume credits (internal use)
exports.consumeCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, reason, meta } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough credits
    if (user.credits < amount) {
      return res.status(402).json({ 
        message: 'Insufficient credits',
        required: amount,
        available: user.credits
      });
    }

    // Atomic debit operation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: -amount } },
      { new: true }
    );

    // Log the credit event
    await CreditEvent.create({
      user: userId,
      type: 'consume',
      amount: -amount,
      balanceAfter: updatedUser.credits,
      reason: reason || 'AI operation',
      meta: meta || {}
    });

    res.json({
      success: true,
      balance: updatedUser.credits,
      consumed: amount
    });
  } catch (error) {
    console.error('Error consuming credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Purchase credits (Stripe webhook will call this)
exports.purchaseCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, paymentId, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Atomic credit operation
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the credit event
    await CreditEvent.create({
      user: userId,
      type: 'purchase',
      amount,
      balanceAfter: user.credits,
      reason: 'Credit purchase',
      meta: {
        paymentId,
        orderId
      }
    });

    // Reset low credit notification flag if credits are above threshold
    if (user.credits > 20) {
      await User.findByIdAndUpdate(userId, { lowCreditNotificationSent: false });
    }

    res.json({
      success: true,
      balance: user.credits,
      purchased: amount
    });
  } catch (error) {
    console.error('Error purchasing credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user has enough credits
exports.checkCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { required } = req.query;

    const user = await User.findById(userId).select('credits');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasEnough = !required || user.credits >= parseInt(required);

    res.json({
      balance: user.credits,
      hasEnough,
      required: parseInt(required) || 0
    });
  } catch (error) {
    console.error('Error checking credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a Stripe Checkout session for buying a credit pack
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packId } = req.body;

    const pack = CREDIT_PACKS[packId];
    if (!pack) return res.status(400).json({ message: 'Invalid pack id' });

    const domain = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${pack.credits} AI Credits`, metadata: { packId: pack.id } },
            unit_amount: pack.price_cents
          },
          quantity: 1
        }
      ],
      metadata: { userId, packId: pack.id, credits: pack.credits },
      success_url: `${domain}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/credits/cancel`
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// Stripe webhook to handle checkout.session.completed events
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (!webhookSecret) {
      // If no webhook secret set, try to parse JSON (less secure, dev only)
      event = req.body;
    } else {
      // When using express.raw, req.body is a Buffer (raw bytes)
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event && event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const packId = metadata.packId;
    const credits = parseInt(metadata.credits || 0);
    const paymentId = session.id;

    if (!userId || !credits) {
      console.warn('Webhook missing userId or credits in metadata');
      return res.status(200).json({ received: true });
    }

    try {
      // Idempotency: don't credit the same session twice
      const existing = await CreditEvent.findOne({ 'meta.paymentId': paymentId });
      if (existing) {
        console.info('Stripe webhook already processed for session:', paymentId);
        return res.status(200).json({ received: true });
      }

      const user = await User.findByIdAndUpdate(userId, { $inc: { credits } }, { new: true });
      if (!user) {
        console.warn('User not found for webhook userId:', userId);
        return res.status(200).json({ received: true });
      }

      await CreditEvent.create({
        user: userId,
        type: 'purchase',
        amount: credits,
        balanceAfter: user.credits,
        reason: 'Stripe purchase',
        meta: { paymentId, packId }
      });

      // Reset low balance flag if needed
      if (user.credits > 20) {
        await User.findByIdAndUpdate(userId, { lowCreditNotificationSent: false });
      }

      console.info(`Credited ${credits} credits to user ${userId} (session ${paymentId})`);
    } catch (err) {
      console.error('Error processing stripe webhook:', err);
    }
  }

  res.status(200).json({ received: true });
};

// Grant credits (admin/system use)
exports.grantCredits = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await CreditEvent.create({
      user: userId,
      type: 'grant',
      amount,
      balanceAfter: user.credits,
      reason: reason || 'Admin grant',
      meta: {}
    });

    res.json({
      success: true,
      balance: user.credits,
      granted: amount
    });
  } catch (error) {
    console.error('Error granting credits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
