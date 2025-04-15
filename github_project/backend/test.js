// Testskript für die YAVU IRI Filler-System API

const { sequelize, User, Studio, Customer, Treatment, Availability, Appointment } = require('./db');

// Funktion zum Testen der Datenbankverbindung
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Datenbankverbindung erfolgreich hergestellt');
    return true;
  } catch (error) {
    console.error('❌ Fehler bei der Datenbankverbindung:', error);
    return false;
  }
}

// Funktion zum Testen der Benutzer-API
async function testUserAPI() {
  console.log('\n--- Teste Benutzer-API ---');
  try {
    // Teste Benutzer erstellen
    const testUser = await User.create({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      type: 'kunde'
    });
    console.log('✅ Benutzer erstellt:', testUser.username);
    
    // Teste Benutzer abrufen
    const retrievedUser = await User.findByPk(testUser.id);
    if (retrievedUser && retrievedUser.username === 'testuser') {
      console.log('✅ Benutzer erfolgreich abgerufen');
    } else {
      console.error('❌ Fehler beim Abrufen des Benutzers');
    }
    
    // Teste Benutzer aktualisieren
    await testUser.update({ email: 'updated@example.com' });
    const updatedUser = await User.findByPk(testUser.id);
    if (updatedUser && updatedUser.email === 'updated@example.com') {
      console.log('✅ Benutzer erfolgreich aktualisiert');
    } else {
      console.error('❌ Fehler beim Aktualisieren des Benutzers');
    }
    
    // Teste Benutzer löschen
    await testUser.destroy();
    const deletedUser = await User.findByPk(testUser.id);
    if (!deletedUser) {
      console.log('✅ Benutzer erfolgreich gelöscht');
    } else {
      console.error('❌ Fehler beim Löschen des Benutzers');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Testen der Benutzer-API:', error);
    return false;
  }
}

// Funktion zum Testen der Studio-API
async function testStudioAPI() {
  console.log('\n--- Teste Studio-API ---');
  try {
    // Erstelle einen Testbenutzer für das Studio
    const testUser = await User.create({
      username: 'teststudio',
      password: 'password123',
      email: 'studio@example.com',
      type: 'studio'
    });
    
    // Teste Studio erstellen
    const testStudio = await Studio.create({
      user_id: testUser.id,
      name: 'Test Beauty Studio',
      location: 'Berlin',
      contact: 'Kontaktperson',
      phone: '0123456789',
      status: 'active',
      registration_date: new Date().toISOString().split('T')[0]
    });
    console.log('✅ Studio erstellt:', testStudio.name);
    
    // Teste Treatment erstellen
    const testTreatment = await Treatment.create({
      studio_id: testStudio.id,
      name: 'Test Treatment',
      description: 'Ein Testbehandlung',
      duration: 60,
      price: 99.99,
      status: 'active'
    });
    console.log('✅ Treatment erstellt:', testTreatment.name);
    
    // Teste Verfügbarkeit erstellen
    const testAvailability = await Availability.create({
      studio_id: testStudio.id,
      day_of_week: 1, // Montag
      start_time: '09:00:00',
      end_time: '17:00:00'
    });
    console.log('✅ Verfügbarkeit erstellt für Tag', testAvailability.day_of_week);
    
    // Teste Studio mit Treatments und Verfügbarkeiten abrufen
    const retrievedStudio = await Studio.findByPk(testStudio.id, {
      include: [Treatment, Availability]
    });
    
    if (retrievedStudio && 
        retrievedStudio.Treatments && retrievedStudio.Treatments.length > 0 &&
        retrievedStudio.Availabilities && retrievedStudio.Availabilities.length > 0) {
      console.log('✅ Studio mit Treatments und Verfügbarkeiten erfolgreich abgerufen');
    } else {
      console.error('❌ Fehler beim Abrufen des Studios mit Treatments und Verfügbarkeiten');
    }
    
    // Aufräumen
    await testTreatment.destroy();
    await testAvailability.destroy();
    await testStudio.destroy();
    await testUser.destroy();
    
    console.log('✅ Studio-Testdaten erfolgreich gelöscht');
    
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Testen der Studio-API:', error);
    return false;
  }
}

// Funktion zum Testen der Termin-API
async function testAppointmentAPI() {
  console.log('\n--- Teste Termin-API ---');
  try {
    // Erstelle Testdaten
    const testUserCustomer = await User.create({
      username: 'testcustomer',
      password: 'password123',
      email: 'customer@example.com',
      type: 'kunde'
    });
    
    const testCustomer = await Customer.create({
      user_id: testUserCustomer.id,
      first_name: 'Test',
      last_name: 'Kunde',
      phone: '0123456789',
      status: 'active'
    });
    
    const testUserStudio = await User.create({
      username: 'teststudio2',
      password: 'password123',
      email: 'studio2@example.com',
      type: 'studio'
    });
    
    const testStudio = await Studio.create({
      user_id: testUserStudio.id,
      name: 'Test Beauty Studio 2',
      location: 'München',
      contact: 'Kontaktperson',
      phone: '9876543210',
      status: 'active',
      registration_date: new Date().toISOString().split('T')[0]
    });
    
    const testTreatment = await Treatment.create({
      studio_id: testStudio.id,
      name: 'Test Treatment 2',
      description: 'Eine weitere Testbehandlung',
      duration: 90,
      price: 149.99,
      status: 'active'
    });
    
    const testAvailability = await Availability.create({
      studio_id: testStudio.id,
      day_of_week: 2, // Dienstag
      start_time: '10:00:00',
      end_time: '18:00:00'
    });
    
    // Teste Termin erstellen
    // Erstelle einen Termin für nächsten Dienstag
    const today = new Date();
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + (9 - today.getDay()) % 7);
    
    const testAppointment = await Appointment.create({
      customer_id: testCustomer.id,
      studio_id: testStudio.id,
      treatment_id: testTreatment.id,
      appointment_date: nextTuesday.toISOString().split('T')[0],
      start_time: '14:00:00',
      end_time: '15:30:00',
      status: 'pending',
      notes: 'Testtermin'
    });
    console.log('✅ Termin erstellt für', testAppointment.appointment_date);
    
    // Teste Termin abrufen
    const retrievedAppointment = await Appointment.findByPk(testAppointment.id, {
      include: [Customer, Studio, Treatment]
    });
    
    if (retrievedAppointment && 
        retrievedAppointment.Customer && 
        retrievedAppointment.Studio && 
        retrievedAppointment.Treatment) {
      console.log('✅ Termin mit Kunde, Studio und Treatment erfolgreich abgerufen');
    } else {
      console.error('❌ Fehler beim Abrufen des Termins mit Kunde, Studio und Treatment');
    }
    
    // Teste Termin aktualisieren
    await testAppointment.update({ status: 'confirmed' });
    const updatedAppointment = await Appointment.findByPk(testAppointment.id);
    if (updatedAppointment && updatedAppointment.status === 'confirmed') {
      console.log('✅ Termin erfolgreich aktualisiert');
    } else {
      console.error('❌ Fehler beim Aktualisieren des Termins');
    }
    
    // Aufräumen
    await testAppointment.destroy();
    await testTreatment.destroy();
    await testAvailability.destroy();
    await testStudio.destroy();
    await testCustomer.destroy();
    await testUserStudio.destroy();
    await testUserCustomer.destroy();
    
    console.log('✅ Termin-Testdaten erfolgreich gelöscht');
    
    return true;
  } catch (error) {
    console.error('❌ Fehler beim Testen der Termin-API:', error);
    return false;
  }
}

// Hauptfunktion zum Ausführen aller Tests
async function runTests() {
  console.log('=== Starte Tests für YAVU IRI Filler-System API ===\n');
  
  // Teste Datenbankverbindung
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.error('❌ Tests abgebrochen: Keine Datenbankverbindung');
    return;
  }
  
  // Führe Tests aus
  await testUserAPI();
  await testStudioAPI();
  await testAppointmentAPI();
  
  console.log('\n=== Tests abgeschlossen ===');
}

// Führe Tests aus
runTests()
  .then(() => {
    console.log('Tests beendet');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fehler beim Ausführen der Tests:', error);
    process.exit(1);
  });
