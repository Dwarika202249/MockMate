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
  },
  // Session management
  refreshToken: {
    type: String,
    default: null
  },
  refreshTokenExpiry: {
    type: Date,
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Index for faster refresh token lookup
UserSchema.index({ refreshToken: 1, refreshTokenExpiry: 1 });

module.exports = mongoose.model("User", UserSchema);
