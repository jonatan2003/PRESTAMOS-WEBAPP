const express = require('express');
const Loginrouter = express.Router();
const { login } = require('../controllers/login.controller'); // Asegúrate de que la ruta del controlador sea correcta

// Ruta para la autenticación (inicio de sesión)
Loginrouter.post('/', login);

export default Loginrouter;
