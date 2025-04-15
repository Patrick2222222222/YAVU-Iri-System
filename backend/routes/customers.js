const express = require('express');
const { Customer, User, Appointment, Studio, Favorite, sequelize } = require('../db');
const router = express.Router();

// GET alle Kunden
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        }
      ]
    });
    res.json(customers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kunden:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Kunden' });
  }
});

// GET einen Kunden nach ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username', 'email']
        },
        {
          model: Appointment,
          include: [
            {
              model: Studio,
              attributes: ['name', 'location']
            }
          ]
        },
        {
          model: Studio,
          as: 'Favorites',
          through: { attributes: [] }
        }
      ]
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Fehler beim Abrufen des Kunden:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Kunden' });
  }
});

// POST neuen Kunden erstellen
router.post('/', async (req, res) => {
  const { 
    user_id, first_name, last_name, phone, status = 'active'
  } = req.body;
  
  // Validierung
  if (!user_id || !first_name || !last_name) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob der Benutzer existiert und vom Typ "kunde" ist
    const user = await User.findOne({
      where: {
        id: user_id,
        type: 'kunde'
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Ungültiger Benutzer oder Benutzertyp' });
    }
    
    // Prüfen, ob bereits ein Kundenprofil für diesen Benutzer existiert
    const existingCustomer = await Customer.findOne({
      where: {
        user_id: user_id
      }
    });
    
    if (existingCustomer) {
      return res.status(409).json({ message: 'Für diesen Benutzer existiert bereits ein Kundenprofil' });
    }
    
    // Kunde erstellen
    const newCustomer = await Customer.create({
      user_id,
      first_name,
      last_name,
      phone: phone || '',
      status
    });
    
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Fehler beim Erstellen des Kunden:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Kunden' });
  }
});

// PUT Kunden aktualisieren
router.put('/:id', async (req, res) => {
  const { first_name, last_name, phone, status } = req.body;
  const customerId = req.params.id;
  
  // Validierung
  if (!first_name || !last_name) {
    return res.status(400).json({ message: 'Vorname und Nachname müssen angegeben werden' });
  }
  
  try {
    // Prüfen, ob der Kunde existiert
    const customer = await Customer.findByPk(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    
    // Kunde aktualisieren
    await customer.update({
      first_name,
      last_name,
      phone: phone || '',
      status: status || 'active'
    });
    
    res.json({ message: 'Kunde erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Kunden:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Kunden' });
  }
});

// DELETE Kunde löschen
router.delete('/:id', async (req, res) => {
  try {
    // Prüfen, ob der Kunde Termine hat
    const appointmentCount = await Appointment.count({
      where: {
        customer_id: req.params.id
      }
    });
    
    if (appointmentCount > 0) {
      return res.status(409).json({ 
        message: 'Kunde kann nicht gelöscht werden, da er Termine hat' 
      });
    }
    
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    
    await customer.destroy();
    
    res.json({ message: 'Kunde erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Kunden:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Kunden' });
  }
});

// POST Studio zu Favoriten hinzufügen
router.post('/:id/favorites', async (req, res) => {
  const { studio_id } = req.body;
  const customerId = req.params.id;
  
  // Validierung
  if (!studio_id) {
    return res.status(400).json({ message: 'Studio-ID muss angegeben werden' });
  }
  
  try {
    // Prüfen, ob der Kunde existiert
    const customer = await Customer.findByPk(customerId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Kunde nicht gefunden' });
    }
    
    // Prüfen, ob das Studio existiert
    const studio = await Studio.findByPk(studio_id);
    
    if (!studio) {
      return res.status(404).json({ message: 'Studio nicht gefunden' });
    }
    
    // Prüfen, ob das Studio bereits in den Favoriten ist
    const existingFavorite = await Favorite.findOne({
      where: {
        customer_id: customerId,
        studio_id: studio_id
      }
    });
    
    if (existingFavorite) {
      return res.status(409).json({ message: 'Studio ist bereits in den Favoriten' });
    }
    
    // Favorit hinzufügen
    const newFavorite = await Favorite.create({
      customer_id: customerId,
      studio_id: studio_id
    });
    
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Favoriten:', error);
    res.status(500).json({ message: 'Serverfehler beim Hinzufügen des Favoriten' });
  }
});

// DELETE Studio aus Favoriten entfernen
router.delete('/:id/favorites/:studioId', async (req, res) => {
  const customerId = req.params.id;
  const studioId = req.params.studioId;
  
  try {
    const favorite = await Favorite.findOne({
      where: {
        customer_id: customerId,
        studio_id: studioId
      }
    });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorit nicht gefunden' });
    }
    
    await favorite.destroy();
    
    res.json({ message: 'Favorit erfolgreich entfernt' });
  } catch (error) {
    console.error('Fehler beim Entfernen des Favoriten:', error);
    res.status(500).json({ message: 'Serverfehler beim Entfernen des Favoriten' });
  }
});

module.exports = router;
