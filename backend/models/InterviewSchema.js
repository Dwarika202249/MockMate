const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  type: { type: String, required: true },
  details: { type: String},
  numQuestions: { type: Number, required: true },
  difficulty: { type: String, required: true },
  questions: { type: [String], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
