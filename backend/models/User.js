const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: { type: String },
  photoURL: { type: String, default: "" },
  credits: {
    type: Number,
    default: 100, // Free credits on first signup
    min: 0
  },
  creditsGrantedAt: {
    type: Date,
    default: Date.now
  },
  lowCreditNotificationSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
