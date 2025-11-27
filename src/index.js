require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * PLANTILLA: Servidor Express Base
 * 
 * Este es el archivo principal del servidor.
 * Ya está configurado con lo esencial.
 */

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors()); // Habilitar CORS para todos los orígenes
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// EJEMPLO: Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// RUTAS PRINCIPALES
// ============================================

// Ruta raíz - Información de la API
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API REST - Plantilla Base',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      items: '/api/items',
      admin: '/api/admin'
    },
    documentation: 'Ver README.md para más información'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Montar todas las rutas de la API
app.use('/api', apiRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
