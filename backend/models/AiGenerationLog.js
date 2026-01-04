const mongoose = require('mongoose');

const AiGenerationLogSchema = new mongoose.Schema({
  adminKeyMasked: { type: String },
  tech: { type: String },
  numQuestions: { type: Number },
  difficulty: { type: String },
  creditCost: { type: Number },
  success: { type: Boolean, default: false },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiGenerationLog', AiGenerationLogSchema);
