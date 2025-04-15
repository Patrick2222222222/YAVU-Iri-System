const express = require('express');
const path = require('path');
const router = express.Router();

// Statische Dateien aus dem public-Verzeichnis bereitstellen
router.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Fallback-Route für SPA (Single Page Application)
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = router;
