const mongoose = require('mongoose');

const CreditReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['reserved', 'committed', 'released'], default: 'reserved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CreditReservationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CreditReservation', CreditReservationSchema);
