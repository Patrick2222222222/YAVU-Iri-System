const fs = require('fs');
const path = require('path');
const { 
  User, 
  Studio, 
  Customer, 
  Treatment, 
  Availability, 
  sequelize 
} = require('./db');

// Pfad zur JSON-Datei mit den Testdaten
const dataFilePath = path.join(__dirname, '..', 'data', 'database.js');

// Funktion zum Extrahieren der Daten aus der JavaScript-Datei
async function extractDataFromJsFile() {
  try {
    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(dataFilePath)) {
      console.error('Datei nicht gefunden:', dataFilePath);
      return null;
    }
    
    // Lese die Datei ein
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    
    // Extrahiere den JSON-Teil (alles zwischen den geschweiften Klammern nach "const database = ")
    const match = fileContent.match(/const\s+database\s*=\s*({[\s\S]*});/);
    
    if (!match || !match[1]) {
      throw new Error('Konnte keine Daten aus der Datei extrahieren');
    }
    
    // Konvertiere den extrahierten String in ein JavaScript-Objekt
    // Wir verwenden eval, da die Datei JavaScript-Syntax enthält, die JSON.parse nicht verarbeiten kann
    // In einer Produktionsumgebung sollte eine sicherere Alternative verwendet werden
    const dataString = match[1];
    const data = eval(`(${dataString})`);
    
    return data;
  } catch (error) {
    console.error('Fehler beim Extrahieren der Daten:', error);
    return null;
  }
}

// Funktion zum Migrieren der Daten in die Datenbank
async function migrateData() {
  try {
    console.log('Starte Datenmigration...');
    
    // Extrahiere Daten aus der JS-Datei
    const data = await extractDataFromJsFile();
    
    if (!data) {
      throw new Error('Keine Daten zum Migrieren gefunden');
    }
    
    // Migriere Benutzer
    await migrateUsers(data.users);
    
    // Migriere Studios
    await migrateStudios(data.studios);
    
    // Migriere Treatments
    await migrateTreatments(data.studios);
    
    // Migriere Verfügbarkeiten
    await migrateAvailability(data.studios);
    
    console.log('Datenmigration erfolgreich abgeschlossen');
    return true;
  } catch (error) {
    console.error('Fehler bei der Datenmigration:', error);
    return false;
  }
}

// Funktion zum Migrieren der Benutzer
async function migrateUsers(users) {
  console.log('Migriere Benutzer...');
  
  for (const user of users) {
    try {
      // Prüfe, ob der Benutzer bereits existiert
      const existingUser = await User.findOne({ where: { username: user.username } });
      
      if (existingUser) {
        console.log(`Benutzer ${user.username} existiert bereits, überspringe...`);
        continue;
      }
      
      // Füge den Benutzer hinzu
      const newUser = await User.create({
        username: user.username,
        password: user.password,
        email: `${user.username}@example.com`, // Dummy-E-Mail, da nicht in den Originaldaten vorhanden
        type: user.type
      });
      
      console.log(`Benutzer ${user.username} hinzugefügt mit ID ${newUser.id}`);
      
      // Wenn es sich um einen Kunden handelt, füge einen Eintrag in die customers-Tabelle hinzu
      if (user.type === 'kunde') {
        await Customer.create({
          user_id: newUser.id,
          first_name: 'Max', // Dummy-Vorname
          last_name: 'Mustermann', // Dummy-Nachname
          phone: '0123456789' // Dummy-Telefonnummer
        });
        console.log(`Kundenprofil für Benutzer ${user.username} erstellt`);
      }
      
      // Speichere die Benutzer-ID für die spätere Verwendung
      user.dbId = newUser.id;
    } catch (error) {
      console.error(`Fehler beim Migrieren des Benutzers ${user.username}:`, error);
    }
  }
}

// Funktion zum Migrieren der Studios
async function migrateStudios(studios) {
  console.log('Migriere Studios...');
  
  for (const studio of studios) {
    try {
      // Finde den zugehörigen Benutzer
      const user = await User.findOne({ 
        where: { 
          type: 'studio',
          username: 'studio' // Annahme: Der Benutzername des Studios ist "studio"
        } 
      });
      
      if (!user) {
        console.log('Kein passender Studio-Benutzer gefunden, überspringe...');
        continue;
      }
      
      // Prüfe, ob das Studio bereits existiert
      const existingStudio = await Studio.findOne({ where: { name: studio.name } });
      
      if (existingStudio) {
        console.log(`Studio ${studio.name} existiert bereits, überspringe...`);
        studio.dbId = existingStudio.id; // Speichere die ID für die spätere Verwendung
        continue;
      }
      
      // Füge das Studio hinzu
      const newStudio = await Studio.create({
        user_id: user.id,
        name: studio.name,
        location: studio.location,
        contact: studio.contact,
        phone: studio.phone,
        rating: studio.rating || 0,
        review_count: studio.reviewCount || 0,
        status: studio.status || 'active',
        registration_date: studio.registrationDate || new Date().toISOString().split('T')[0]
      });
      
      console.log(`Studio ${studio.name} hinzugefügt mit ID ${newStudio.id}`);
      
      // Speichere die Studio-ID für die spätere Verwendung
      studio.dbId = newStudio.id;
    } catch (error) {
      console.error(`Fehler beim Migrieren des Studios ${studio.name}:`, error);
    }
  }
}

// Funktion zum Migrieren der Treatments
async function migrateTreatments(studios) {
  console.log('Migriere Treatments...');
  
  for (const studio of studios) {
    if (!studio.dbId || !studio.treatments) {
      continue;
    }
    
    for (const treatment of studio.treatments) {
      try {
        // Prüfe, ob das Treatment bereits existiert
        const existingTreatment = await Treatment.findOne({
          where: {
            studio_id: studio.dbId,
            name: treatment.name
          }
        });
        
        if (existingTreatment) {
          console.log(`Treatment ${treatment.name} für Studio ${studio.name} existiert bereits, überspringe...`);
          continue;
        }
        
        // Füge das Treatment hinzu
        const newTreatment = await Treatment.create({
          studio_id: studio.dbId,
          name: treatment.name,
          description: treatment.description || '',
          duration: treatment.duration || 60, // Standarddauer, falls nicht angegeben
          price: treatment.price || 0, // Standardpreis, falls nicht angegeben
          status: 'active'
        });
        
        console.log(`Treatment ${treatment.name} für Studio ${studio.name} hinzugefügt mit ID ${newTreatment.id}`);
      } catch (error) {
        console.error(`Fehler beim Migrieren des Treatments ${treatment.name}:`, error);
      }
    }
  }
}

// Funktion zum Migrieren der Verfügbarkeiten
async function migrateAvailability(studios) {
  console.log('Migriere Verfügbarkeiten...');
  
  for (const studio of studios) {
    if (!studio.dbId || !studio.availability) {
      continue;
    }
    
    for (const avail of studio.availability) {
      try {
        // Konvertiere den Tag in eine Zahl (1-7 für Montag-Sonntag)
        let dayNumber;
        switch (avail.day) {
          case 1: dayNumber = 1; break; // Montag
          case 2: dayNumber = 2; break; // Dienstag
          case 3: dayNumber = 3; break; // Mittwoch
          case 4: dayNumber = 4; break; // Donnerstag
          case 5: dayNumber = 5; break; // Freitag
          case 6: dayNumber = 6; break; // Samstag
          case 7: dayNumber = 7; break; // Sonntag
          default: dayNumber = 1; // Standardwert: Montag
        }
        
        // Prüfe, ob die Verfügbarkeit bereits existiert
        const existingAvailability = await Availability.findOne({
          where: {
            studio_id: studio.dbId,
            day_of_week: dayNumber,
            start_time: avail.start,
            end_time: avail.end
          }
        });
        
        if (existingAvailability) {
          console.log(`Verfügbarkeit für Tag ${dayNumber} (${avail.start}-${avail.end}) für Studio ${studio.name} existiert bereits, überspringe...`);
          continue;
        }
        
        // Füge die Verfügbarkeit hinzu
        const newAvailability = await Availability.create({
          studio_id: studio.dbId,
          day_of_week: dayNumber,
          start_time: avail.start,
          end_time: avail.end
        });
        
        console.log(`Verfügbarkeit für Tag ${dayNumber} (${avail.start}-${avail.end}) für Studio ${studio.name} hinzugefügt mit ID ${newAvailability.id}`);
      } catch (error) {
        console.error(`Fehler beim Migrieren der Verfügbarkeit für Tag ${avail.day}:`, error);
      }
    }
  }
}

module.exports = {
  migrateData
};
