const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  answers: { type: [{ questionId: String, score: Number, selected: [String] }], default: [] },
  totalScore: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  reservedCreditsId: { type: String }
});

module.exports = mongoose.model('QuizAttempt', AttemptSchema);
