const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Erstellen der Express-App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basis-Route
app.get('/api', (req, res) => {
  res.json({ message: 'Willkommen zur YAVU IRI Filler-System API' });
});

// Einfache Demo-Routen für die Live-Schaltung
app.get('/api/studios', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Beauty Studio Berlin',
      location: 'Berlin',
      contact: 'Kontaktperson',
      phone: '0123456789',
      rating: 4.8,
      treatments: [
        { id: 1, name: 'IRI Filler Behandlung', duration: 60, price: 199.99 },
        { id: 2, name: 'Hyaluron Auffrischung', duration: 30, price: 99.99 }
      ]
    },
    {
      id: 2,
      name: 'Kosmetik Oase München',
      location: 'München',
      contact: 'Kontaktperson',
      phone: '9876543210',
      rating: 4.6,
      treatments: [
        { id: 3, name: 'Nadelfreie Hyaluron-Behandlung', duration: 45, price: 149.99 },
        { id: 4, name: 'Anti-Aging Komplett', duration: 90, price: 249.99 }
      ]
    }
  ]);
});

app.get('/api/users/login', (req, res) => {
  res.json({
    id: 1,
    username: 'studio',
    email: 'studio@example.com',
    type: 'studio'
  });
});

// Fallback-Route für SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Server starten
app.listen(port, '0.0.0.0', async () => {
  console.log(`Server läuft auf Port ${port}`);
});

module.exports = app;
