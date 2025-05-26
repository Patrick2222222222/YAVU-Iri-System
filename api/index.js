const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Temporäre Daten
let users = [
  { id: 1, username: 'admin', password: 'password', role: 'admin' },
  { id: 2, username: 'studio', password: 'password', role: 'studio' },
  { id: 3, username: 'kunde', password: 'password', role: 'customer' }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YAVU API running' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/users', (req, res) => res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role }))));
app.get('/api/studios', (req, res) => res.json([{ id: 1, name: 'Studio Beauty', location: 'Berlin' }]));
app.get('/api/appointments', (req, res) => res.json([]));
app.get('/api/stats', (req, res) => res.json({ totalUsers: users.length, totalStudios: 1, totalAppointments: 0 }));

module.exports = app;
