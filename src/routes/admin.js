const express = require('express');
const router = express.Router();
// const DataStore = require('../models/DataStore');  // PLANTILLA: Descomenta cuando crees DataStore.js
const GestorVisitas = require('../models/GestorVisitas');

/**
 * PLANTILLA: Rutas de Administración/Utilidades
 * 
 * Rutas para funciones administrativas o de utilidad.
 */

/**
 * EJEMPLO: Obtener estadísticas generales de items
 * GET /api/admin/stats
 * NOTA: Comentado porque requiere DataStore.js (plantilla genérica)
 */
/*
router.get('/stats', (req, res) => {
  try {
    const total = DataStore.contar();
    const activos = DataStore.contar({ estado: 'activo' });
    const inactivos = DataStore.contar({ estado: 'inactivo' });

    res.json({
      success: true,
      data: {
        total,
        activos,
        inactivos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});
*/

/**
 * Obtener estadísticas de visitas
 * GET /api/admin/estadisticas-visitas
 */
router.get('/estadisticas-visitas', (req, res) => {
  try {
    const estadisticas = GestorVisitas.obtenerEstadisticas();

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de visitas',
      error: error.message
    });
  }
});

/**
 * Reiniciar sistema de visitas
 * POST /api/admin/reiniciar-visitas
 */
router.post('/reiniciar-visitas', (req, res) => {
  try {
    GestorVisitas.reiniciar();

    res.json({
      success: true,
      message: 'Sistema de visitas reiniciado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al reiniciar sistema de visitas',
      error: error.message
    });
  }
});

/**
 * EJEMPLO: Limpiar datos de items (útil para testing)
 * POST /api/admin/clear
 * NOTA: Comentado porque requiere DataStore.js (plantilla genérica)
 */
/*
router.post('/clear', (req, res) => {
  try {
    DataStore.limpiar();

    res.json({
      success: true,
      message: 'Datos limpiados exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al limpiar datos',
      error: error.message
    });
  }
});
*/

module.exports = router;
