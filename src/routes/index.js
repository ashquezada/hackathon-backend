const express = require('express');
const router = express.Router();

/**
 * PLANTILLA: Configuración Central de Rutas
 * 
 * Aquí se agregan todas las rutas de tu API.
 * 
 * INSTRUCCIONES:
 * 1. Crea un archivo de rutas en src/routes/ (ej: usuarios.js)
 * 2. Impórtalo aquí
 * 3. Agrégalo con router.use()
 */

// Importar rutas
// const itemsRoutes = require('./items');  // PLANTILLA: Descomenta cuando crees items.js
const visitasRoutes = require('./visitas');
const adminRoutes = require('./admin');

// EJEMPLO: Rutas de recursos
// router.use('/items', itemsRoutes);       // /api/items (plantilla genérica - descomenta cuando sea necesario)
router.use('/visitas', visitasRoutes);   // /api/visitas (gestión de visitas)
// router.use('/usuarios', usuariosRoutes);  // /api/usuarios
// router.use('/productos', productosRoutes); // /api/productos

// Rutas de administración
router.use('/admin', adminRoutes);        // /api/admin

module.exports = router;
