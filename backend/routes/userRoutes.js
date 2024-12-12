const express = require('express');
const { registerUser, loginUser, getUserContacts} = require('../controllers/userController');

const router = express.Router();

const authenticate = require('../middleware/authenticate'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

//NUEVO LUISA
//Ruta para obtener los contactos
router.get('/contacts', authenticate, getUserContacts); 

module.exports = router;
