const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Path to data files
const portfolioDataPath = path.join(__dirname, 'data', 'portfolioData.json');
const messagesDataPath = path.join(__dirname, 'data', 'messages.json');

// Helper to read JSON data safely
function readJsonFile(filePath, defaultFallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultFallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultFallback;
  }
}

// Helper to write JSON data safely
function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Ensure messages file exists
if (!fs.existsSync(messagesDataPath)) {
  writeJsonFile(messagesDataPath, []);
}

// --- API ROUTES ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Portfolio Data API
app.get('/api/portfolio', (req, res) => {
  const data = readJsonFile(portfolioDataPath, null);
  if (!data) {
    return res.status(500).json({ error: 'Failed to load portfolio data' });
  }
  res.json(data);
});

// 3. Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (Name, Email, Message).'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  // Create message record
  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    read: false
  };

  const messages = readJsonFile(messagesDataPath, []);
  messages.unshift(newMessage); // Prepend to show newest first

  // Keep last 100 messages max to prevent unbounded growth
  const trimmed = messages.slice(0, 100);
  writeJsonFile(messagesDataPath, trimmed);

  console.log(`[Contact] New message from ${newMessage.name} (${newMessage.email})`);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
    data: {
      id: newMessage.id,
      timestamp: newMessage.timestamp
    }
  });
});

// 4. View Received Messages (Admin / Demo endpoint)
app.get('/api/messages', (req, res) => {
  const messages = readJsonFile(messagesDataPath, []);
  res.json({
    total: messages.length,
    messages: messages.slice(0, 20) // return up to 20 recent messages
  });
});

// 5. Clear Messages (Demo reset)
app.delete('/api/messages', (req, res) => {
  writeJsonFile(messagesDataPath, []);
  res.json({ success: true, message: 'Inbox cleared successfully.' });
});

// Fallback to index.html for single-page app behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Portfolio server is running!`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` Health API: http://localhost:${PORT}/api/health`);
    console.log(` Portfolio API: http://localhost:${PORT}/api/portfolio`);
    console.log(`=========================================`);
  });
}

module.exports = app;

