const GestorVisitasSQLite = require('../models/GestorVisitasSQLite');
const GestorVisitantes = require('../models/GestorVisitantes');
const emailService = require('../config/email');
const GestorUsuarios = require('../models/GestorUsuarios');

/**
 * Controlador de Visitas con SQLite
 * Maneja todas las operaciones de gestión de visitas usando base de datos
 */

/**
 * Crear nueva visita
 * POST /api/visitas
 */
const crear = async (req, res) => {
  try {
    const { visitante, motivo, id_anfitrion, inicio, fin, id_usuario } = req.body;

    // Validaciones básicas
    if (!visitante && !id_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos del visitante o usuario que registra la visita'
      });
    };
    if ( typeof visitante !== 'object' || !visitante.dni || !visitante.nombre || !visitante.apellido || !visitante.email) {
      return res.status(400).json({
        success: false,
        message: 'Los datos del visitante estan incompletos'
      });
    };
    if (!motivo || !id_anfitrion || !inicio || !fin) {
        return res.status(400).json({
        success: false,
        message: 'Faltan datos obligatorios para crear la visita'
      });
    };

    const existe_visitante = await GestorVisitantes.buscarPorDNI(visitante.dni);

    if (!existe_visitante) {
        // Crear nuevo visitante
        const nuevo_visitante = await GestorVisitantes.crearVisitante(visitante);
        visitante.id = nuevo_visitante.id;
    } else {
        visitante.id = existe_visitante.id;
    };

    // Crear nueva visita
    const nuevaVisita = await GestorVisitasSQLite.crearVisita({
        id_visita: visitante.id,
        motivo,
        id_anfitrion,
        inicio,
        fin,
        id_usuario
    });

    const anfitrion = await GestorUsuarios.buscarPorId(id_anfitrion);

    await emailService.confirmarVisitaAlVisitante(
        {inicio, fin}, visitante, anfitrion);

    res.status(201).json({
      success: true,
      message: 'Visita registrada exitosamente',
      data: nuevaVisita
    });
  } catch (error) {
    console.error('Error al crear visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la visita',
      error: error.message
    });
  }
};

/**
 * Obtener todas las visitas (con filtros opcionales)
 * GET /api/visitas?estado=esperando&area=TI&fecha=2024-01-01
 */
const obtenerTodas = async (req, res) => {
  try {
    const filtros = req.query;
    const visitas = await GestorVisitasSQLite.obtenerTodas(filtros);

    res.json({
      success: true,
      count: visitas.length,
      data: visitas
    });
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las visitas',
      error: error.message
    });
  }
};

/**
 * Obtener visita por ID
 * GET /api/visitas/:id
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const visita = await GestorVisitasSQLite.obtenerPorId(id);

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
    console.error('Error al obtener visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la visita',
      error: error.message
    });
  }
};

const obtenerPorAnfitrionId = async (req, res) => {
  try {
    const { id } = req.params;
    const visitas = await GestorVisitasSQLite.obtenerPorAnfitrionId(id);

    if (!visitas) {
      return res.status(404).json({
        success: false,
        message: 'El anfitrion no tiene visitas'
      });
    }

    res.json({
      success: true,
      data: visitas
    });
  } catch (error) {
    console.error('Error al obtener visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las visitas',
      error: error.message
    });
  }
};
/**
 * Obtener siguiente visita en espera
 * GET /api/visitas/siguiente
 */
const obtenerSiguiente = async (req, res) => {
  try {
    const siguiente = await GestorVisitasSQLite.obtenerSiguiente();

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
    console.error('Error al obtener siguiente visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la siguiente visita',
      error: error.message
    });
  }
};

/**
 * Actualizar visita (cambiar estado, agregar observaciones, etc.)
 * PUT /api/visitas/:id
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevosDatos = req.body;

    // Validación de estado
    const estadosValidos = ['esperando', 'llamando', 'atendiendo', 'finalizado', 'cancelado'];
    if (nuevosDatos.estado && !estadosValidos.includes(nuevosDatos.estado)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const visitaActualizada = await GestorVisitasSQLite.actualizar(id, nuevosDatos);

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
    console.error('Error al actualizar visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la visita',
      error: error.message
    });
  }
};

/**
 * Cancelar visita
 * DELETE /api/visitas/:id
 */
const cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const visitaCancelada = await GestorVisitasSQLite.cancelar(id, motivo);

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
    console.error('Error al cancelar visita:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la visita',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas
 * GET /api/visitas/estadisticas
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await GestorVisitasSQLite.obtenerEstadisticas();

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
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
  obtenerEstadisticas,
  obtenerPorAnfitrionId
};
