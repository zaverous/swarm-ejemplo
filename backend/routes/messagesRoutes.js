const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messagesController'); // Importa los controladores correspondientes
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación

const router = express.Router();

// Ruta para obtener mensajes de un chat específico
router.get('/', authenticate, getMessages);

// Ruta para enviar un mensaje a un chat
router.post('/', authenticate, sendMessage);

module.exports = router;
