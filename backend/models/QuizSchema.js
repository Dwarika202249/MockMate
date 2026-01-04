const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  id: { type: String },
  text: { type: String },
  isCorrect: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
  id: { type: String },
  text: { type: String, required: true },
  choices: { type: [ChoiceSchema], default: [] },
  scoringType: { type: String, enum: ['single', 'multiple'], default: 'single' },
  partialScoring: { type: Boolean, default: false },
  maxPoints: { type: Number, default: 1 }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techTags: { type: [String], default: [] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isPremium: { type: Boolean, default: false },
  creditCost: { type: Number, default: 0 },
  timeLimitSecs: { type: Number, default: 0 },
  questions: { type: [QuestionSchema], default: [] },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
