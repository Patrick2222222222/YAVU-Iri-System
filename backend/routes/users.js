const express = require('express');
const { User } = require('../db');
const router = express.Router();

// GET alle Benutzer
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Passwort aus der Antwort ausschließen
    });
    res.json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Benutzer' });
  }
});

// GET einen Benutzer nach ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Passwort aus der Antwort ausschließen
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Benutzers' });
  }
});

// POST neuen Benutzer erstellen
router.post('/', async (req, res) => {
  const { username, password, email, type } = req.body;
  
  // Validierung
  if (!username || !password || !email || !type) {
    return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt sein' });
  }
  
  try {
    // Prüfen, ob Benutzername oder E-Mail bereits existieren
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Benutzername oder E-Mail existiert bereits' });
    }
    
    // Benutzer erstellen
    const newUser = await User.create({
      username,
      password, // In einer Produktionsumgebung sollte das Passwort gehasht werden
      email,
      type
    });
    
    // Passwort aus der Antwort ausschließen
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Benutzers' });
  }
});

// PUT Benutzer aktualisieren
router.put('/:id', async (req, res) => {
  const { username, password, email, type } = req.body;
  const userId = req.params.id;
  
  // Validierung
  if (!username || !email || !type) {
    return res.status(400).json({ message: 'Benutzername, E-Mail und Typ müssen angegeben werden' });
  }
  
  try {
    // Prüfen, ob der Benutzer existiert
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    // Prüfen, ob der neue Benutzername oder die E-Mail bereits von einem anderen Benutzer verwendet werden
    const conflictingUser = await User.findOne({
      where: {
        [sequelize.Op.and]: [
          {
            [sequelize.Op.or]: [
              { username: username },
              { email: email }
            ]
          },
          {
            id: { [sequelize.Op.ne]: userId }
          }
        ]
      }
    });
    
    if (conflictingUser) {
      return res.status(409).json({ message: 'Benutzername oder E-Mail wird bereits verwendet' });
    }
    
    // Update-Objekt vorbereiten
    const updateData = {
      username,
      email,
      type
    };
    
    // Wenn ein neues Passwort angegeben wurde, füge es zum Update hinzu
    if (password) {
      updateData.password = password; // In einer Produktionsumgebung sollte das Passwort gehasht werden
    }
    
    // Benutzer aktualisieren
    await user.update(updateData);
    
    res.json({ message: 'Benutzer erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Benutzers' });
  }
});

// DELETE Benutzer löschen
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    await user.destroy();
    
    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Benutzers' });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validierung
  if (!username || !password) {
    return res.status(400).json({ message: 'Benutzername und Passwort müssen angegeben werden' });
  }
  
  try {
    // Benutzer suchen
    const user = await User.findOne({
      where: {
        username: username,
        password: password // In einer Produktionsumgebung sollte das Passwort gehasht und verglichen werden
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    
    // Je nach Benutzertyp zusätzliche Informationen abrufen
    let additionalInfo = {};
    
    if (user.type === 'studio') {
      const studio = await Studio.findOne({ where: { user_id: user.id } });
      if (studio) {
        additionalInfo = studio.toJSON();
      }
    } else if (user.type === 'kunde') {
      const customer = await Customer.findOne({ where: { user_id: user.id } });
      if (customer) {
        additionalInfo = customer.toJSON();
      }
    }
    
    // Passwort aus der Antwort ausschließen
    const userResponse = user.toJSON();
    delete userResponse.password;
    
    res.json({
      ...userResponse,
      ...additionalInfo
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Serverfehler beim Login' });
  }
});

module.exports = router;
