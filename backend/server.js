
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./auth'); // Google OAuth strategy
const { Task, Mood, Peer, User } = require('./models');
const geminiRoute = require('./routes/gemini');
const geminiMicrotasksRoute = require('./routes/geminiMicrotasks');
const geminiQuizRoute = require('./routes/geminiQuiz');
const geminiMoodRoute = require('./routes/geminiMood');
const peersRouter = require('./routes/peers');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {console.log('Connected to MongoDB'); });


// AUTH
app.use('/auth', authRouter);
// TASKS
app.use('/api/gemini', geminiRoute);
app.use('/api/gemini-microtasks', geminiMicrotasksRoute);
app.use('/api/gemini-quiz', geminiQuizRoute);
app.use('/api/gemini-mood', geminiMoodRoute);
app.use('/api/peers', peersRouter); // temporarily public, add authentication middleware when available
// const peerCommentsRouter = require('./routes/peerComments');
// app.use('/api/peers', peerCommentsRouter);
app.get('/api/tasks/:userId', async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

const fetchQuizForMicrotask = async (microtaskTitle) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const res = await fetch('http://localhost:3000/api/gemini-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ microtaskTitle })
    });
    const data = await res.json();
    if (Array.isArray(data.quiz) && data.quiz.length > 0) {
      return data.quiz;
    }
    return [];
  } catch (e) {
    return [];
  }
};

app.post('/api/tasks', async (req, res) => {
  try {
    const body = req.body;
    if (Array.isArray(body.microtasks)) {
      for (let i = 0; i < body.microtasks.length; i++) {
        if (!body.microtasks[i].quiz || !Array.isArray(body.microtasks[i].quiz) || body.microtasks[i].quiz.length === 0) {
          const quiz = await fetchQuizForMicrotask(body.microtasks[i].title);
          body.microtasks[i].quiz = quiz;
        }
      }
    }
    const task = new Task(body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Error creating task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting task' });
  }
});

// MOODS
app.get('/api/moods/:userId', async (req, res) => {
  const moods = await Mood.find({ userId: req.params.userId });
  res.json(moods);
});

app.get('/api/mood/:id', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) return res.status(404).json({ error: 'Mood not found' });
    res.json(mood);
  } catch (err) {
    res.status(400).json({ error: 'Error finding mood' });
  }
});


// POST /api/moods/gemini: Accept mood input, use Gemini, store and return result
app.post('/api/moods/gemini', async (req, res) => {
  const { userId, date, mood, energy, motivation, notes, moodInput } = req.body;
  if (!userId || !moodInput) return res.status(400).json({ error: 'userId and moodInput required' });
  try {
    // Call Gemini
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const geminiRes = await fetch('http://localhost:3000/api/gemini-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moodInput })
    });
    const geminiData = await geminiRes.json();
    // Store mood entry with Gemini result
    const moodDoc = new Mood({
      userId,
      date: date || new Date().toISOString(),
      mood,
      energy,
      motivation,
      notes,
      geminiRating: geminiData.rating,
      geminiQuote: geminiData.quote,
      geminiAdvice: geminiData.advice
    });
    await moodDoc.save();
    res.status(201).json(moodDoc);
  } catch (err) {
    res.status(400).json({ error: 'Error creating mood entry', details: err.message });
  }
});

app.put('/api/moods/:id', async (req, res) => {
  try {
    const updated = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating mood entry' });
  }
});

app.delete('/api/moods/:id', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mood entry deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting mood entry' });
  }
});

// PEERS
app.get('/api/peers/:userId', async (req, res) => {
  const peers = await Peer.find({ userId: req.params.userId ,});
  res.json(peers);
});

app.get('/api/peer/:id', async (req, res) => {
  try {
    const peer = await Peer.findById(req.params.id);
    if (!peer) return res.status(404).json({ error: 'Peer not found' });
    res.json(peer);
  } catch (err) {
    res.status(400).json({ error: 'Error finding peer' });
  }
});

app.post('/api/peers', async (req, res) => {
  try {
    const peer = new Peer(req.body);
    await peer.save();
    res.status(201).json(peer);
  } catch (err) {
    res.status(400).json({ error: 'Error creating peer' });
  }
});

app.put('/api/peers/:id', async (req, res) => {
  try {
    const updated = await Peer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating peer' });
  }
});

app.delete('/api/peers/:id', async (req, res) => {
  try {
    await Peer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Peer deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting peer' });
  }
});

// Helper: check if email exists (using a simple regex and optionally a real email validation API)
function isValidEmail(email) {
  // Basic regex for email format
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}


// Helper: check if Gmail exists using AbstractAPI
async function isRealGmail(email) {
  if (!/^([a-zA-Z0-9_.+-]+)@gmail\.com$/.test(email)) return false;
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const apiKey = process.env.ABSTRACTAPI_KEY;
  if (!apiKey) return false;
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('AbstractAPI response for', email, ':', JSON.stringify(data));
    // Check if deliverable and is a real Gmail
    return data.deliverability === 'DELIVERABLE' &&
  data.is_valid_format && data.is_valid_format.value &&
  data.is_smtp_valid && data.is_smtp_valid.value &&
  email.toLowerCase().endsWith('@gmail.com');
  } catch (e) {
    console.error('Error calling AbstractAPI:', e);
    return false;
  }
}

app.post('/api/signup', async (req, res) => {
  console.log('Register attempt');
  const { username, email, password } = req.body;
  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email does not exist or is invalid. You cannot make an account using this.' });
    }
    // If Gmail, check if it really exists
    if (/^[^@\s]+@gmail\.com$/.test(email)) {
      console.log('Checking if Gmail exists:', email);
      const exists = await isRealGmail(email);
      if (!exists) {
        console.log('Gmail does not exist:', email);
        return res.status(400).json({ error: 'This Gmail address does not exist on Google servers. Please use a real Gmail.' });
      }
    }
    // Check for existing user by username or email
    const existing = await User.findOne({ $or: [ { username }, { email } ] });
    console.log('Checking for existing user:', username, email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({ username, email, password });
    console.log('Creating new user:', username, email);
    await user.save();
    res.status(201).json({ message: 'User created successfully' ,user: { username: user.username, email: user.email, id: user._id }});
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Login attempt');
  const { usernameOrEmail, password } = req.body;
  if ( !usernameOrEmail || !password ) {
    console.log('Missing username or email and password');
    return res.status(400).json({ error: 'Username or email and password required' });
  }
  try {
    // Allow login by username or email
    const user = await User.findOne({ $or: [ { username: usernameOrEmail }, { email: usernameOrEmail } ] });
    if (!user) {
      console.log('No user found with:', usernameOrEmail);
      return res.status(401).json({ error: 'No account found with this username or email.' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid Credential. Please try again.' });
    }
    res.json({ message: 'Login successful', user: { username: user.username, email: user.email, id: user._id } });
  } catch (err) {
    console.log('Error logging in:', err);
    res.status(400).json({ error: 'Error logging in' });
  }
});

// TASKS
app.get('/api/tasks/:userId', async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

app.get('/api/task/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Error finding task' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Error creating task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting task' });
  }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
