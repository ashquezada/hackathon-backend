const express = require('express');
const router = express.Router();
const GestorUsuarios = require('../models/GestorUsuarios');

/**
 * Obtener todos los usuarios
 * POST /api/login
 */
router.post('/login', async (req, res) => {
  try {
    const datos = req.body;
    let token;
    
    // Validaciones básicas
    if (!datos.dni || !datos.password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios (dni, password)'
      });
    }

    const nuevoUsuario = await GestorUsuarios.buscarPorDNI(datos.dni);

    res.status(201).json({
      success: true,
      message: token,
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Usuario no existente o no autorizado',
      error: error.message
    });
  }
})

module.exports = router;
