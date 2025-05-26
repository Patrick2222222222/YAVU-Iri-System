const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'yavu_iri_system_jwt_secret_2024';

// Users with hashed passwords
let users = [
  {
        id: 1,
        username: 'admin',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        email: 'admin@yavu-iri.com',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        active: true
  },
  {
        id: 2,
        username: 'studio',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        email: 'studio@yavu-iri.com',
        role: 'studio',
        firstName: 'Studio',
        lastName: 'Manager',
        active: true
  },
  {
        id: 3,
        username: 'customer',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        email: 'customer@yavu-iri.com',
        role: 'customer',
        firstName: 'Test',
        lastName: 'Customer',
        active: true
  }
  ];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
          return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
          if (err) {
                  return res.status(403).json({ error: 'Invalid or expired token' });
          }
          req.user = user;
          next();
    });
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
    try {
          const { username, password } = req.body;

      if (!username || !password) {
              return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = users.find(u => u.username === username && u.active);
          if (!user) {
                  return res.status(401).json({ error: 'Invalid credentials' });
          }

      const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
                  return res.status(401).json({ error: 'Invalid credentials' });
          }

      const token = jwt.sign(
        { 
                id: user.id, 
                  username: user.username, 
                  role: user.role,
                  email: user.email
        },
              JWT_SECRET,
        { expiresIn: '24h' }
            );

      res.json({
              message: 'Login successful',
              token,
              user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
              }
      });
    } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Internal server error' });
    }
});

// Token validation
app.post('/api/users/validate-token', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Dashboard data
app.get('/api/frontend/dashboard', authenticateToken, (req, res) => {
    const { role } = req.user;
    let dashboardData = {};

          if (role === 'admin') {
                dashboardData = {
                        overview: {
                                  totalStudios: 2,
                                  totalCustomers: 150,
                                  totalAppointments: 45,
                                  totalRevenue: 12500.00
                        },
                        recentActivity: [
                          {
                                      id: 1,
                                      type: 'appointment',
                                      description: 'Neuer Termin für Max Mustermann',
                                      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                                      status: 'success'
                          }
                                ],
                        upcomingAppointments: [
                          {
                                      id: 1,
                                      customerName: 'Anna Schmidt',
                                      service: 'Piercing Beratung',
                                      time: '14:00',
                                      studio: 'YAVU Creative Space'
                          }
                                ]
                };
          } else if (role === 'studio') {
                dashboardData = {
                        overview: {
                                  todayAppointments: 5,
                                  weekAppointments: 23,
                                  monthRevenue: 3200.00,
                                  customerSatisfaction: 4.8
                        },
                        todaySchedule: [
                          {
                                      id: 1,
                                      time: '10:00',
                                      customerName: 'Maria Weber',
                                      service: 'Tattoo Consultation',
                                      duration: 60,
                                      status: 'confirmed'
                          }
                                ]
                };
          } else if (role === 'customer') {
                dashboardData = {
                        overview: {
                                  nextAppointment: {
                                              date: '2024-02-15T14:00:00.000Z',
                                              service: 'Tattoo Touch-up',
                                              studio: 'YAVU Main Studio'
                                  },
                                  totalTreatments: 3,
                                  totalSpent: 750.00
                        },
                        appointments: [
                          {
                                      id: 1,
                                      date: '2024-02-15T14:00:00.000Z',
                                      service: 'Tattoo Touch-up',
                                      studio: 'YAVU Main Studio',
                                      status: 'confirmed'
                          }
                                ]
                };
          }

          res.json(dashboardData);
});

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Route handlers
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/studio', (req, res) => {
    res.sendFile(path.join(__dirname, '../studio.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, '../customer.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
                             error: 'API endpoint not found',
          path: req.originalUrl,
          method: req.method
    });
});

// For Vercel
module.exports = app;
