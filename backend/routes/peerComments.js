const express = require('express');
const router = express.Router();
const PeerComment = require('../models/PeerComment');
const User = require('../models/User');

// Get all comments for a peer (user)
router.get('/:peerId/comments', async (req, res) => {
  try {
    const comments = await PeerComment.find({ peer: req.params.peerId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a peer (user)
router.post('/:peerId/comments', async (req, res) => {
  try {
    const { text, authorId } = req.body;
    if (!text || !authorId) return res.status(400).json({ message: 'Missing text or authorId' });
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    // Only allow if author is a recipient of a peer request from this peer
    const PeerRequest = require('../models/PeerRequest');
    const allowed = await PeerRequest.exists({ requester: req.params.peerId, recipient: authorId, status: 'accepted' });
    if (!allowed) return res.status(403).json({ message: 'You are not allowed to comment on this user.' });
    const comment = await PeerComment.create({
      peer: req.params.peerId,
      author: authorId,
      text
    });
    await comment.populate('author', 'name');
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
