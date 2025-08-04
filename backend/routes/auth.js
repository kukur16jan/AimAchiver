const express = require('express');
const passport = require('passport');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) return res.status(404).json({ error: 'No user with that email' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // Configure nodemailer (use your real email credentials in production)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Reset your password - Aim Achiever',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
          <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src='https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' alt='Aim Achiever' style='width:48px; height:48px; border-radius:8px;'/>
              <h2 style="margin: 16px 0 0 0; color: #4f46e5; font-size: 2rem;">Aim Achiever</h2>
            </div>
            <h3 style="color: #111827; font-size: 1.25rem; margin-bottom: 12px;">Reset your password</h3>
            <p style="color: #374151; font-size: 1rem; margin-bottom: 24px;">We received a request to reset your password. Click the button below to set a new password. If you didn't request this, you can safely ignore this email.</p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(90deg, #2563eb, #a21caf); color: #fff; padding: 12px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1rem;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 0.95rem;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 0.95rem;">${resetUrl}</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 0.9rem; text-align: center;">&copy; ${new Date().getFullYear()} Aim Achiever. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error sending reset email:', err);
    res.status(500).json({ error: 'Error sending reset email' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password is required' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    // On success, redirect to frontend with user info or token
    res.redirect('http://localhost:5173'); // Adjust to your frontend URL
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/login');
  });
});

// Get current authenticated user (for Google login)
router.get('/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
