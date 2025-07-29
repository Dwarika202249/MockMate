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
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
