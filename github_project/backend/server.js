const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, testConnection, initializeDatabase } = require('./db');
const { migrateData } = require('./dataMigration');
require('dotenv').config();

// Erstellen der Express-App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routen importieren
const usersRoutes = require('./routes/users');
const studiosRoutes = require('./routes/studios');
const customersRoutes = require('./routes/customers');
const treatmentsRoutes = require('./routes/treatments');
const appointmentsRoutes = require('./routes/appointments');
const frontendRoutes = require('./routes/frontend');

// Datenbank initialisieren
async function setupDatabase() {
  try {
    const connected = await testConnection();
    if (connected) {
      await initializeDatabase();
      console.log('Datenbank erfolgreich initialisiert');
      
      // Daten migrieren, wenn die Datenbank leer ist
      const users = await sequelize.models.User.count();
      if (users === 0) {
        console.log('Keine Benutzer gefunden, starte Datenmigration...');
        await migrateData();
      } else {
        console.log('Benutzer bereits vorhanden, überspringe Datenmigration');
      }
    } else {
      console.error('Konnte keine Verbindung zur Datenbank herstellen. Server wird beendet.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Fehler beim Einrichten der Datenbank:', error);
    process.exit(1);
  }
}

// Statische Dateien aus dem public-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basis-Route
app.get('/api', (req, res) => {
  res.json({ message: 'Willkommen zur YAVU IRI Filler-System API' });
});

// API-Routen registrieren
app.use('/api/users', usersRoutes);
app.use('/api/studios', studiosRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/treatments', treatmentsRoutes);
app.use('/api/appointments', appointmentsRoutes);

// Frontend-Routen als letztes registrieren (Fallback)
app.use('/', frontendRoutes);

// Server starten
app.listen(port, '0.0.0.0', async () => {
  console.log(`Server läuft auf Port ${port}`);
  await setupDatabase();
});

module.exports = app;
