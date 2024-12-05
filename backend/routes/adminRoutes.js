const express = require('express');
const { getFullDatabase } = require('../config/db');
const router = express.Router();

// Ruta para obtener todas las colecciones de la base de datos
router.get('/database', async (req, res) => {
  try {
    const data = await getFullDatabase();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la base de datos completa' });
  }
});

module.exports = router;
