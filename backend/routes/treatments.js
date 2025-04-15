const express = require('express');
const { Treatment, Studio, Appointment, sequelize } = require('../db');
const router = express.Router();

// GET alle Treatments
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      include: [
        {
          model: Studio,
          attributes: ['name', 'location']
        }
      ]
    });
    res.json(treatments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Treatments' });
  }
});

// GET ein Treatment nach ID
router.get('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id, {
      include: [
        {
          model: Studio,
          attributes: ['name', 'location']
        }
      ]
    });
    
    if (!treatment) {
      return res.status(404).json({ message: 'Treatment nicht gefunden' });
    }
    
    res.json(treatment);
  } catch (error) {
    console.error('Fehler beim Abrufen des Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Treatments' });
  }
});

// PUT Treatment aktualisieren
router.put('/:id', async (req, res) => {
  const { name, description, duration, price, status } = req.body;
  const treatmentId = req.params.id;
  
  // Validierung
  if (!name || !duration || !price) {
    return res.status(400).json({ message: 'Name, Dauer und Preis müssen angegeben werden' });
  }
  
  try {
    // Prüfen, ob das Treatment existiert
    const treatment = await Treatment.findByPk(treatmentId);
    
    if (!treatment) {
      return res.status(404).json({ message: 'Treatment nicht gefunden' });
    }
    
    // Treatment aktualisieren
    await treatment.update({
      name,
      description: description || '',
      duration,
      price,
      status: status || 'active'
    });
    
    res.json({ message: 'Treatment erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Treatments' });
  }
});

// DELETE Treatment löschen
router.delete('/:id', async (req, res) => {
  try {
    // Prüfen, ob das Treatment in Terminen verwendet wird
    const appointmentCount = await Appointment.count({
      where: {
        treatment_id: req.params.id
      }
    });
    
    if (appointmentCount > 0) {
      return res.status(409).json({ 
        message: 'Treatment kann nicht gelöscht werden, da es in Terminen verwendet wird' 
      });
    }
    
    const treatment = await Treatment.findByPk(req.params.id);
    
    if (!treatment) {
      return res.status(404).json({ message: 'Treatment nicht gefunden' });
    }
    
    await treatment.destroy();
    
    res.json({ message: 'Treatment erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Treatments:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Treatments' });
  }
});

module.exports = router;
