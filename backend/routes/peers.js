// Get users who are recipients of my peer requests (i.e., can comment on me)

const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');
const User = require('../models/User');
const PeerRequest = require('../models/PeerRequest');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PeerComment = require('../models/PeerComment');
// Configure your mail transport (update with your SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SMAIL_PASS
  }
});
router.get('/:userId/recipients', async (req, res) => {
  try {
    const requests = await PeerRequest.find({ requester: req.params.userId, status: 'accepted' }).populate('recipient', 'name email');
    const users = requests.map(r => r.recipient);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// All peer routes require authentication
// router.use(ensureAuthenticated);
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email level xp streak');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get use
// Invite a peer (only if user exists)
router.post('/invite', async (req, res) => {
  console.log('Received peer invitation request:', req.body);
  const { recipientEmail,  requesterId } = req.body;
  if (!requesterId) {
    return res.status(400).json({ message: 'Missing userId in request body' });
  }
  try {
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: 'User not found' });
    if (recipient._id.equals(requesterId)) return res.status(400).json({ message: 'Cannot add yourself as peer' });

    // Check for existing request or peer
    const existing = await PeerRequest.findOne({
      $or: [
        { requester: requesterId, recipient: recipient._id },
        { requester: recipient._id, recipient: requesterId }
      ],
      status: { $in: ['pending', 'accepted'] }
    });
    if (existing) return res.status(400).json({ message: 'Peer request already exists or already peers' });

    // Create token
    const token = jwt.sign({ requesterId, recipientId: recipient._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const peerRequest = new PeerRequest({ requester: requesterId, recipient: recipient._id, token });
    await peerRequest.save();

    // Send beautiful email
    const acceptUrl = `${process.env.FRONTEND_URL}/peers/accept/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Aim Achiever Peer Invitation',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
          <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src='https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' alt='Aim Achiever' style='width:48px; height:48px; border-radius:8px;'/>
              <h2 style="margin: 16px 0 0 0; color: #4f46e5; font-size: 2rem;">Aim Achiever</h2>
            </div>
            <h3 style="color: #111827; font-size: 1.25rem; margin-bottom: 12px;">You've been invited to be a peer!</h3>
            <p style="color: #374151; font-size: 1rem; margin-bottom: 24px;">A fellow Aim Achiever user wants to connect with you as a peer for mutual support and accountability. Click the button below to accept the invitation.</p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(90deg, #2563eb, #a21caf); color: #fff; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1rem;">Accept Invitation</a>
            </div>
            <p style="color: #6b7280; font-size: 0.95rem;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 0.95rem;">${acceptUrl}</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 0.9rem; text-align: center;">&copy; ${new Date().getFullYear()} Aim Achiever. All rights reserved.</p>
          </div>
        </div>
      `
    });
    res.json({ message: 'Invitation sent' });
  } catch (err) {
    console.error('Error sending peer invitation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/who-added-me', async (req, res) => {
  // Accept userId as query param for stateless auth
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });
  try {
     console.log("Before fetching requests:", userId);
    // Find all PeerRequests where recipient is userId and status is accepted
    const requests = await PeerRequest.find({ recipient: userId, status: 'accepted' }).populate('requester', 'name email');
    // Return the requester users
    console.log("After fetching requests:", requests);
    const users = requests.map(r => r.requester);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Accept peer request
router.get('/accept/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const peerRequest = await PeerRequest.findOne({ token, status: 'pending' });
    if (!peerRequest) return res.status(400).json({ message: 'Invalid or expired token' });
    peerRequest.status = 'accepted';
    await peerRequest.save();
    // Optionally, add each other to a 'peers' array in User model
    res.redirect(`${process.env.FRONTEND_URL}/peers?accepted=1`);
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Remove a peer
router.delete('/:peerId', async (req, res) => {
  const { peerId } = req.params;
  const userId = req.query.userId;
  try {
    const peerRequest = await PeerRequest.findOneAndDelete({
      $or: [
        { requester: userId, recipient: peerId, status: 'accepted' },
        { requester: peerId, recipient: userId, status: 'accepted' }
      ]
    });
    if (!peerRequest) return res.status(404).json({ message: 'Peer not found' });
    res.json({ message: 'Peer removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List peers and pending requests
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  try {
    const peers = await PeerRequest.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).populate('requester recipient', 'name email');
    res.json(peers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
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
    const { text, authorId ,authorName} = req.body;
    if (!text || !authorId) return res.status(400).json({ message: 'Missing text or authorId' });
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    const comment = await PeerComment.create({
      peer: req.params.peerId,
      author: authorId,
      name: authorName,
      text
    });
    await comment.populate('author', 'name');
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
