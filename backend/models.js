const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  description: String,
  deadline: String,
  status: String,
  microtasks: [
    {
      id: String,
      title: String,
      day: Number,
      completed: Boolean,
      completedAt: String,
      quizTaken: Boolean,
      quizScore: Number,
      quiz: [
        {
          question: String,
          options: [String],
          answer: String
        }
      ]
    }
  ],
  createdAt: String,
  completedAt: String,
  priority: String,
  category: String
});

const moodSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: String,
  mood: Number,
  energy: Number,
  motivation: Number,
  notes: String,
  geminiRating: Number,
  geminiQuote: String,
  geminiAdvice: String
});

const peerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: String,
  email: String,
  avatar: String,
  relationship: String,
  status: String
});



const User = require('./models/User');

module.exports = {
  Task: mongoose.model('Task', taskSchema),
  Mood: mongoose.model('Mood', moodSchema),
  Peer: mongoose.model('Peer', peerSchema),
  User
};
