const express = require('express');
const router = express.Router();
const GestorUsuarios = require('../models/GestorUsuarios');

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 */
router.get('/', async (req, res) => {
  try {
    const filtros = req.query;
    const usuarios = await GestorUsuarios.obtenerTodos(filtros);

    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await GestorUsuarios.buscarPorId(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

/**
 * Obtener usuarios por perfil
 * GET /api/usuarios/perfil/:idPerfil
 */
router.get('/perfil/:idPerfil', async (req, res) => {
  try {
    const { idPerfil } = req.params;
    const usuarios = await GestorUsuarios.obtenerPorPerfil(idPerfil);

    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios por perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios por perfil',
      error: error.message
    });
  }
});

/**
 * Obtener usuarios por área
 * GET /api/usuarios/area/:idArea
 */
router.get('/area/:idArea', async (req, res) => {
  try {
    const { idArea } = req.params;
    const usuarios = await GestorUsuarios.obtenerTodos({ id_area: idArea });

    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios por área:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios por área',
      error: error.message
    });
  }
});

/**
 * Crear nuevo usuario
 * POST /api/usuarios
 */
router.post('/', async (req, res) => {
  try {
    const datos = req.body;
    
    // Validaciones básicas
    if (!datos.dni || !datos.nombre || !datos.apellido || !datos.email || !datos.id_perfil) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios (dni, nombre, apellido, email, id_perfil)'
      });
    }

    const nuevoUsuario = await GestorUsuarios.crearUsuario(datos);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
});

/**
 * Actualizar usuario
 * PUT /api/usuarios/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const usuarioActualizado = await GestorUsuarios.actualizarUsuario(id, datos);

    if (!usuarioActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

/**
 * Dar de baja usuario
 * DELETE /api/usuarios/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioBaja = await GestorUsuarios.darDeBaja(id);

    if (!usuarioBaja) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario dado de baja exitosamente',
      data: usuarioBaja
    });
  } catch (error) {
    console.error('Error al dar de baja usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al dar de baja usuario',
      error: error.message
    });
  }
});

module.exports = router;
