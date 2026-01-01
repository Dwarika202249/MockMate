const mongoose = require('mongoose');

const creditEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['grant', 'consume', 'purchase', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  meta: {
    interviewId: mongoose.Schema.Types.ObjectId,
    interviewType: String, // 'free' or 'resume'
    operation: String, // 'question_generation', 'answer_evaluation', 'summary_generation'
    paymentId: String,
    orderId: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient querying
creditEventSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('CreditEvent', creditEventSchema);
