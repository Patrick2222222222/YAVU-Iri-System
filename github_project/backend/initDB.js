// Initialisierungsskript für die Datenbank

const { sequelize, initializeDatabase } = require('./db');

async function initDB() {
  try {
    console.log('Starte Datenbankinitialisierung...');
    
    // Datenbank initialisieren (Tabellen erstellen)
    await initializeDatabase();
    
    console.log('Datenbank erfolgreich initialisiert');
    process.exit(0);
  } catch (error) {
    console.error('Fehler bei der Datenbankinitialisierung:', error);
    process.exit(1);
  }
}

// Skript ausführen
initDB();
