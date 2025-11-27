const DataStore = require('../models/DataStore');

/**
 * PLANTILLA: Controlador Genérico
 * 
 * Este controlador maneja todas las operaciones CRUD básicas.
 * Puedes copiar y personalizar según tus necesidades.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo según tu entidad
 * 2. Ajusta las validaciones según tus campos
 * 3. Agrega lógica de negocio específica
 */

/**
 * PLANTILLA: Crear nuevo recurso
 * POST /api/items
 */
const crear = (req, res) => {
  try {
    // Extraer datos del body
    const datos = req.body;

    // EJEMPLO: Validaciones básicas
    // if (!datos.nombre) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'El campo nombre es requerido'
    //   });
    // }

    // Crear nuevo item
    const nuevoItem = DataStore.crear(datos);

    res.status(201).json({
      success: true,
      message: 'Recurso creado exitosamente',
      data: nuevoItem.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el recurso',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener todos los recursos (con filtros opcionales)
 * GET /api/items?estado=activo&nombre=ejemplo
 */
const obtenerTodos = (req, res) => {
  try {
    // Extraer filtros de query params
    const filtros = req.query;
    
    // Obtener items con filtros
    const items = DataStore.obtenerTodos(filtros);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener recursos',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Obtener recurso por ID
 * GET /api/items/:id
 */
const obtenerPorId = (req, res) => {
  try {
    const { id } = req.params;
    const item = DataStore.obtenerPorId(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el recurso',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Actualizar recurso
 * PUT /api/items/:id
 */
const actualizar = (req, res) => {
  try {
    const { id } = req.params;
    const nuevosDatos = req.body;

    // EJEMPLO: Validaciones
    // if (nuevosDatos.estado && !['activo', 'inactivo'].includes(nuevosDatos.estado)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Estado inválido'
    //   });
    // }

    const itemActualizado = DataStore.actualizar(id, nuevosDatos);

    if (!itemActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Recurso actualizado exitosamente',
      data: itemActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el recurso',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Eliminar recurso
 * DELETE /api/items/:id
 */
const eliminar = (req, res) => {
  try {
    const { id } = req.params;
    const itemEliminado = DataStore.eliminar(id);

    if (!itemEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Recurso eliminado exitosamente',
      data: itemEliminado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el recurso',
      error: error.message
    });
  }
};

/**
 * PLANTILLA: Contar recursos
 * GET /api/items/count
 */
const contar = (req, res) => {
  try {
    const filtros = req.query;
    const total = DataStore.contar(filtros);

    res.json({
      success: true,
      data: { total }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al contar recursos',
      error: error.message
    });
  }
};

module.exports = {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
  contar
};
