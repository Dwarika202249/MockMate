const User = require('../models/User');
const CreditEvent = require('../models/CreditEventSchema');

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
