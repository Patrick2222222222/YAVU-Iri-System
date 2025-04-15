const express = require('express');
const { Appointment, Customer, Studio, Treatment, sequelize } = require('../db');
const router = express.Router();

// GET alle Termine
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Customer,
          attributes: ['first_name', 'last_name']
        },
        {
          model: Studio,
          attributes: ['name']
        },
        {
          model: Treatment,
          attributes: ['name', 'duration']
        }
      ],
      order: [
        ['appointment_date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });
    res.json(appointments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Termine:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Termine' });
  }
});

// GET Termine eines Kunden
router.get('/customer/:customerId', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        customer_id: req.params.customerId
      },
      include: [
        {
          model: Studio,
          attributes: ['name', 'location']
        },
        {
          model: Treatment,
          attributes: ['name', 'duration']
        }
      ],
      order: [
        ['appointment_date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kundentermine:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Kundentermine' });
  }
});

// GET Termine eines Studios
router.get('/studio/:studioId', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        studio_id: req.params.studioId
      },
      include: [
        {
          model: Customer,
          attributes: ['first_name', 'last_name']
        },
        {
          model: Treatment,
          attributes: ['name', 'duration']
        }
      ],
      order: [
        ['appointment_date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Studiotermine:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Studiotermine' });
  }
});

// GET einen Termin nach ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          attributes: ['first_name', 'last_name']
        },
        {
          model: Studio,
          attributes: ['name', 'location']
        },
        {
          model: Treatment,
          attributes: ['name', 'duration']
        }
      ]
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Termin nicht gefunden' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Fehler beim Abrufen des Termins:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Termins' });
  }
});

// POST neuen Termin erstellen
router.post('/', async (req, res) => {
  const { 
    customer_id, studio_id, treatment_id, 
    appointment_date, start_time, end_time, 
    status = 'pending', notes = '' 
  } = req.body;
  
  // Validierung
  if (!customer_id || !studio_id || !treatment_id || !appointment_date || !start_time || !end_time) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob der Kunde existiert
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(400).json({ message: 'Kunde nicht gefunden' });
    }
    
    // Prüfen, ob das Studio existiert
    const studio = await Studio.findByPk(studio_id);
    if (!studio) {
      return res.status(400).json({ message: 'Studio nicht gefunden' });
    }
    
    // Prüfen, ob die Behandlung existiert und zum Studio gehört
    const treatment = await Treatment.findOne({
      where: {
        id: treatment_id,
        studio_id: studio_id
      }
    });
    if (!treatment) {
      return res.status(400).json({ message: 'Behandlung nicht gefunden oder gehört nicht zum angegebenen Studio' });
    }
    
    // Prüfen, ob der Termin in die Verfügbarkeit des Studios passt
    const appointmentDay = new Date(appointment_date).getDay();
    // Konvertiere JavaScript-Wochentag (0=Sonntag, 1=Montag, ...) zu unserem Format (1=Montag, ..., 7=Sonntag)
    const dayOfWeek = appointmentDay === 0 ? 7 : appointmentDay;
    
    const availability = await Availability.findOne({
      where: {
        studio_id: studio_id,
        day_of_week: dayOfWeek,
        start_time: { [sequelize.Op.lte]: start_time },
        end_time: { [sequelize.Op.gte]: end_time }
      }
    });
    
    if (!availability) {
      return res.status(400).json({ message: 'Der gewählte Termin liegt außerhalb der Verfügbarkeit des Studios' });
    }
    
    // Prüfen, ob der Termin mit anderen Terminen kollidiert
    const conflictingAppointment = await Appointment.findOne({
      where: {
        studio_id: studio_id,
        appointment_date: appointment_date,
        [sequelize.Op.or]: [
          {
            start_time: { [sequelize.Op.lte]: start_time },
            end_time: { [sequelize.Op.gt]: start_time }
          },
          {
            start_time: { [sequelize.Op.lt]: end_time },
            end_time: { [sequelize.Op.gte]: end_time }
          }
        ],
        status: { [sequelize.Op.ne]: 'cancelled' }
      }
    });
    
    if (conflictingAppointment) {
      return res.status(409).json({ message: 'Der gewählte Termin kollidiert mit einem bestehenden Termin' });
    }
    
    // Termin erstellen
    const newAppointment = await Appointment.create({
      customer_id,
      studio_id,
      treatment_id,
      appointment_date,
      start_time,
      end_time,
      status,
      notes
    });
    
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Fehler beim Erstellen des Termins:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Termins' });
  }
});

// PUT Termin aktualisieren
router.put('/:id', async (req, res) => {
  const { 
    appointment_date, start_time, end_time, status, notes 
  } = req.body;
  const appointmentId = req.params.id;
  
  // Validierung
  if (!appointment_date || !start_time || !end_time || !status) {
    return res.status(400).json({ message: 'Alle Pflichtfelder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob der Termin existiert
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Termin nicht gefunden' });
    }
    
    // Wenn das Datum oder die Zeit geändert wurden, prüfe Verfügbarkeit und Konflikte
    if (appointment_date !== appointment.appointment_date || 
        start_time !== appointment.start_time || 
        end_time !== appointment.end_time) {
      
      // Prüfen, ob der Termin in die Verfügbarkeit des Studios passt
      const appointmentDay = new Date(appointment_date).getDay();
      // Konvertiere JavaScript-Wochentag (0=Sonntag, 1=Montag, ...) zu unserem Format (1=Montag, ..., 7=Sonntag)
      const dayOfWeek = appointmentDay === 0 ? 7 : appointmentDay;
      
      const availability = await Availability.findOne({
        where: {
          studio_id: appointment.studio_id,
          day_of_week: dayOfWeek,
          start_time: { [sequelize.Op.lte]: start_time },
          end_time: { [sequelize.Op.gte]: end_time }
        }
      });
      
      if (!availability) {
        return res.status(400).json({ message: 'Der gewählte Termin liegt außerhalb der Verfügbarkeit des Studios' });
      }
      
      // Prüfen, ob der Termin mit anderen Terminen kollidiert
      const conflictingAppointment = await Appointment.findOne({
        where: {
          studio_id: appointment.studio_id,
          appointment_date: appointment_date,
          [sequelize.Op.or]: [
            {
              start_time: { [sequelize.Op.lte]: start_time },
              end_time: { [sequelize.Op.gt]: start_time }
            },
            {
              start_time: { [sequelize.Op.lt]: end_time },
              end_time: { [sequelize.Op.gte]: end_time }
            }
          ],
          status: { [sequelize.Op.ne]: 'cancelled' },
          id: { [sequelize.Op.ne]: appointmentId }
        }
      });
      
      if (conflictingAppointment) {
        return res.status(409).json({ message: 'Der gewählte Termin kollidiert mit einem bestehenden Termin' });
      }
    }
    
    // Termin aktualisieren
    await appointment.update({
      appointment_date,
      start_time,
      end_time,
      status,
      notes: notes || ''
    });
    
    res.json({ message: 'Termin erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Termins:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Termins' });
  }
});

// DELETE Termin löschen
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Termin nicht gefunden' });
    }
    
    await appointment.destroy();
    
    res.json({ message: 'Termin erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Termins:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Termins' });
  }
});

module.exports = router;
