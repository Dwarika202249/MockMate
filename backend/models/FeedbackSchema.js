const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String },
  text: { type: String },
  type: { type: String },
  expectedKeywords: [{ type: String }],
  order: { type: Number },
});

const AnswerFeedbackSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100 },
  label: { type: String },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  feedbackText: { type: String },
});

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String },
  text: { type: String },
  feedback: { type: AnswerFeedbackSchema, default: () => ({}) },
});

const PerQuestionFeedbackSchema = new mongoose.Schema({
  questionId: { type: String },
  question: { type: String },
  answer: { type: String },
  score: { type: Number },
  label: { type: String },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  feedback: { type: String },
});

const SummarySchema = new mongoose.Schema({
  averageScore: { type: Number },
  keyStrengths: [{ type: String }],
  areasToImprove: [{ type: String }],
  recommendedResources: [{ type: String }],
  // Per-question detailed feedback (used by free interview quick feedback)
  perQuestionFeedback: { type: [PerQuestionFeedbackSchema], default: [] },
});

const FeedbackSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, enum: ['local', 'ai'], default: 'ai' },
  questions: { type: [QuestionSchema], default: [] },
  answers: { type: [AnswerSchema], default: [] },
  summary: { type: SummarySchema, default: () => ({}) },
  version: { type: Number, default: 1 },
  // legacy fields kept for backward compatibility (optional)
  legacy: {
    rawQuestions: { type: [String], default: [] },
    rawAnswers: { type: [String], default: [] },
    rawFeedback: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FeedbackSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
