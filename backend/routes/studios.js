const express = require('express');
const { Studio, User, Treatment, Availability, Review, Customer, sequelize } = require('../db');
const router = express.Router();

// GET alle Studios
router.get('/', async (req, res) => {
  try {
    const studios = await Studio.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        }
      ]
    });
    res.json(studios);
  } catch (error) {
    console.error('Fehler beim Abrufen der Studios:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Studios' });
  }
});

// GET ein Studio nach ID
router.get('/:id', async (req, res) => {
  try {
    const studio = await Studio.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        },
        {
          model: Treatment
        },
        {
          model: Availability
        },
        {
          model: Review,
          include: [
            {
              model: Customer,
              attributes: ['first_name', 'last_name']
            }
          ]
        }
      ]
    });
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    res.json(studio);
  } catch (error) {
    console.error('Fehler beim Abrufen des Studios:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Studios' });
  }
});

// POST neues Studio erstellen
router.post('/', async (req, res) => {
  const { 
    user_id, name, location, contact, phone, 
    status = 'pending', registration_date = new Date().toISOString().split('T')[0]
  } = req.body;
  
  // Validierung
  if (!user_id || !name || !location || !contact || !phone) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob der Benutzer existiert und vom Typ "studio" ist
    const user = await User.findOne({
      where: {
        id: user_id,
        type: 'studio'
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger Benutzer oder Benutzertyp' });
    }
    
    // Studio erstellen
    const newStudio = await Studio.create({
      user_id,
      name,
      location,
      contact,
      phone,
      status,
      registration_date
    });
    
    res.status(201).json(newStudio);
  } catch (error) {
    console.error('Fehler beim Erstellen des Studios:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Studios' });
  }
});

// PUT Studio aktualisieren
router.put('/:id', async (req, res) => {
  const { name, location, contact, phone, status } = req.body;
  const studioId = req.params.id;
  
  // Validierung
  if (!name || !location || !contact || !phone) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob das Studio existiert
    const studio = await Studio.findByPk(studioId);
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    // Studio aktualisieren
    await studio.update({
      name,
      location,
      contact,
      phone,
      status: status || 'active'
    });
    
    res.json({ message: 'Studio erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Studios:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Studios' });
  }
});

// DELETE Studio löschen
router.delete('/:id', async (req, res) => {
  try {
    const studio = await Studio.findByPk(req.params.id);
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    await studio.destroy();
    
    res.json({ message: 'Studio erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Studios:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Studios' });
  }
});

// GET Treatments eines Studios
router.get('/:id/treatments', async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      where: {
        studio_id: req.params.id
      }
    });
    
    res.json(treatments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Treatments' });
  }
});

// POST neues Treatment für ein Studio
router.post('/:id/treatments', async (req, res) => {
  const { name, description, duration, price, status = 'active' } = req.body;
  const studioId = req.params.id;
  
  // Validierung
  if (!name || !duration || !price) {
    return res.status(400).json({ message: 'Name, Dauer und Preis müssen angegeben werden' });
  }
  
  try {
    // Prüfen, ob das Studio existiert
    const studio = await Studio.findByPk(studioId);
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    // Treatment erstellen
    const newTreatment = await Treatment.create({
      studio_id: studioId,
      name,
      description: description || '',
      duration,
      price,
      status
    });
    
    res.status(201).json(newTreatment);
  } catch (error) {
    console.error('Fehler beim Erstellen des Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Treatments' });
  }
});

// GET Verfügbarkeiten eines Studios
router.get('/:id/availability', async (req, res) => {
  try {
    const availabilities = await Availability.findAll({
      where: {
        studio_id: req.params.id
      },
      order: [
        ['day_of_week', 'ASC'],
        ['start_time', 'ASC']
      ]
    });
    
    res.json(availabilities);
  } catch (error) {
    console.error('Fehler beim Abrufen der Verfügbarkeiten:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Verfügbarkeiten' });
  }
});

// POST neue Verfügbarkeit für ein Studio
router.post('/:id/availability', async (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const studioId = req.params.id;
  
  // Validierung
  if (!day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Wochentag, Startzeit und Endzeit müssen angegeben werden' });
  }
  
  if (day_of_week < 1 || day_of_week > 7) {
    return res.status(400).json({ message: 'Wochentag muss zwischen 1 (Montag) und 7 (Sonntag) liegen' });
  }
  
  try {
    // Prüfen, ob das Studio existiert
    const studio = await Studio.findByPk(studioId);
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    // Verfügbarkeit erstellen
    const newAvailability = await Availability.create({
      studio_id: studioId,
      day_of_week,
      start_time,
      end_time
    });
    
    res.status(201).json(newAvailability);
  } catch (error) {
    console.error('Fehler beim Erstellen der Verfügbarkeit:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen der Verfügbarkeit' });
  }
});

module.exports = router;
