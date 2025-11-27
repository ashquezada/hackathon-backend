const GestorVisitas = require('../models/GestorVisitas');

/**
 * PLANTILLA: Controlador de Visitas
 * 
 * Este controlador maneja todas las operaciones de gestión de visitas.
 * Puedes copiar y personalizar según tus necesidades.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo según tu entidad
 * 2. Ajusta las validaciones según tus campos
 * 3. Agrega lógica de negocio específica
 */

/**
 * PLANTILLA: Crear nueva visita
 * POST /api/visitas
 */
const crear = (req, res) => {
  try {
    const { visitante, documento, empresa, telefono, motivo, personaVisitada, area, observaciones } = req.body;

    // EJEMPLO: Validaciones básicas
    if (!visitante) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del visitante es requerido'
      });
    }

    if (!documento) {
      return res.status(400).json({
        success: false,
        message: 'El documento del visitante es requerido'
      });
    }

    // Crear nueva visita
    const nuevaVisita = GestorVisitas.crear({
      visitante,
      documento,
      empresa,
      telefono,
      motivo,
      personaVisitada,
      area,
      observaciones
    });

    res.status(201).json({
      success: true,
      message: 'Visita registrada exitosamente',
      data: nuevaVisita.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar la visita',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener todas las visitas (con filtros opcionales)
 * GET /api/visitas?estado=esperando&empresa=TechCorp
 */
const obtenerTodas = (req, res) => {
  try {
    const filtros = req.query;
    const visitas = GestorVisitas.obtenerTodas(filtros);

    res.json({
      success: true,
      count: visitas.length,
      data: visitas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las visitas',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener visita por ID
 * GET /api/visitas/:id
 */
const obtenerPorId = (req, res) => {
  try {
    const { id } = req.params;
    const visita = GestorVisitas.obtenerPorId(id);

    if (!visita) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }

    res.json({
      success: true,
      data: visita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la visita',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener siguiente visita en espera
 * GET /api/visitas/siguiente
 */
const obtenerSiguiente = (req, res) => {
  try {
    const siguiente = GestorVisitas.obtenerSiguiente();

    if (!siguiente) {
      return res.status(404).json({
        success: false,
        message: 'No hay visitas en espera'
      });
    }

    res.json({
      success: true,
      data: siguiente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la siguiente visita',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Actualizar visita (cambiar estado, agregar observaciones, etc.)
 * PUT /api/visitas/:id
 */
const actualizar = (req, res) => {
  try {
    const { id } = req.params;
    const nuevosDatos = req.body;

    // EJEMPLO: Validación de estado
    const estadosValidos = ['esperando', 'llamando', 'atendiendo', 'finalizado', 'cancelado'];
    if (nuevosDatos.estado && !estadosValidos.includes(nuevosDatos.estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const visitaActualizada = GestorVisitas.actualizar(id, nuevosDatos);

    if (!visitaActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Visita actualizada exitosamente',
      data: visitaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la visita',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Cancelar visita
 * DELETE /api/visitas/:id
 */
const cancelar = (req, res) => {
  try {
    const { id } = req.params;
    
    // Primero actualizar el estado a cancelado
    const visitaCancelada = GestorVisitas.actualizar(id, { estado: 'cancelado' });

    if (!visitaCancelada) {
      return res.status(404).json({
        success: false,
        message: 'Visita no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Visita cancelada exitosamente',
      data: visitaCancelada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la visita',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener estadísticas
 * GET /api/visitas/estadisticas
 */
const obtenerEstadisticas = (req, res) => {
  try {
    const estadisticas = GestorVisitas.obtenerEstadisticas();

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  crear,
  obtenerTodas,
  obtenerPorId,
  obtenerSiguiente,
  actualizar,
  cancelar,
  obtenerEstadisticas
};
