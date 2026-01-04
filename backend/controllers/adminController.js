const Quiz = require('../models/QuizSchema');
const CreditReservation = require('../models/CreditReservationSchema');

// Admin-only: publish a quiz
exports.publishQuiz = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-api-key'];
    if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    quiz.isPublished = true;
    await quiz.save();

    res.json({ quiz });
  } catch (err) {
    console.error('Error publishing quiz:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin-only: list active reservations (optional filters)
exports.listReservations = async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-api-key'];
    if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { status = 'reserved' } = req.query;
    const reservations = await CreditReservation.find({ status }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ reservations });
  } catch (err) {
    console.error('Error listing reservations:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};