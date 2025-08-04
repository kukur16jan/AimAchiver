const mongoose = require('mongoose');

const PeerCommentSchema = new mongoose.Schema({
  peer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user being commented on
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The peer who comments
  name: { type: String, required: true }, // Name of the author
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PeerComment', PeerCommentSchema);
