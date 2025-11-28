const express = require('express');
const router = express.Router();
// Usar controlador con SQLite (o el de memoria si prefieres)
const visitasController = require('../controllers/visitasControllerSQLite');

/**
 * PLANTILLA: Rutas de Visitas
 * 
 * Estas rutas siguen el patrón REST estándar para gestión de visitas.
 * Puedes copiar este archivo y personalizarlo para otras entidades.
 * 
 * INSTRUCCIONES:
 * 1. Renombra este archivo según tu recurso (ej: clientes.js, productos.js)
 * 2. Ajusta las rutas según necesites
 * 3. Importa el controlador correspondiente
 */

// CRUD Básico de Visitas
router.post('/', visitasController.crear);              // Registrar nueva visita
router.get('/', visitasController.obtenerTodas);        // Listar visitas (con filtros)
router.get('/siguiente', visitasController.obtenerSiguiente);  // Siguiente en espera
router.get('/estadisticas', visitasController.obtenerEstadisticas);  // Estadísticas
router.get('/:id', visitasController.obtenerPorId);     // Obtener visita específica
router.put('/:id', visitasController.actualizar);       // Actualizar visita (cambiar estado, etc.)
router.delete('/:id', visitasController.cancelar);      // Cancelar visita

// EJEMPLO: Rutas personalizadas adicionales
// router.get('/hoy', visitasController.obtenerVisitasHoy);
// router.get('/por-empresa/:empresa', visitasController.obtenerPorEmpresa);
// router.post('/:id/llamar', visitasController.llamarVisita);
// router.post('/:id/atender', visitasController.atenderVisita);
// router.post('/:id/finalizar', visitasController.finalizarVisita);

module.exports = router;
