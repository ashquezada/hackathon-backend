const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseController');

/**
 * PLANTILLA: Rutas CRUD Básicas
 * 
 * Estas rutas siguen el patrón REST estándar.
 * Puedes copiar este archivo y personalizarlo.
 * 
 * INSTRUCCIONES:
 * 1. Renombra este archivo según tu recurso (ej: usuarios.js, productos.js)
 * 2. Ajusta las rutas según necesites
 * 3. Importa el controlador correspondiente
 */

// CRUD Básico
router.post('/', baseController.crear);           // Crear
router.get('/', baseController.obtenerTodos);     // Listar (con filtros)
router.get('/:id', baseController.obtenerPorId);  // Obtener uno
router.put('/:id', baseController.actualizar);    // Actualizar
router.delete('/:id', baseController.eliminar);   // Eliminar

// Rutas adicionales
router.get('/count/total', baseController.contar); // Contar

// EJEMPLO: Rutas personalizadas
// router.get('/activos', baseController.obtenerActivos);
// router.post('/:id/activar', baseController.activar);
// router.post('/bulk', baseController.crearMultiples);

module.exports = router;
