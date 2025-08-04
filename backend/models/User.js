const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google users
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // Optionally, add more fields (e.g., peers, etc.)
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
