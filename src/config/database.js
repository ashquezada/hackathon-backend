/**
 * PLANTILLA: Configuración de Base de Datos
 * 
 * Configuración para conectar a diferentes bases de datos.
 * Por defecto usa memoria, pero puedes cambiar a MongoDB o PostgreSQL.
 * 
 * INSTRUCCIONES:
 * 1. Elige tu tipo de BD en .env: DB_TYPE=memory|mongodb|postgresql
 * 2. Configura las credenciales en .env
 * 3. Instala el driver necesario:
 *    - MongoDB: npm install mongodb mongoose
 *    - PostgreSQL: npm install pg
 */

const config = {
  // Tipo de base de datos: memory, mongodb, postgresql
  type: process.env.DB_TYPE || 'memory',
  
  // ========================================
  // MONGODB
  // ========================================
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_base_datos',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Opciones adicionales
      // serverSelectionTimeoutMS: 5000,
      // socketTimeoutMS: 45000,
    }
  },

  // ========================================
  // POSTGRESQL
  // ========================================
  postgresql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'mi_base_datos',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    // Opciones adicionales
    // ssl: process.env.DB_SSL === 'true',
    // max: 20, // pool size
  },

  // ========================================
  // MYSQL (opcional)
  // ========================================
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'mi_base_datos',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  }
};

/**
 * EJEMPLO: Función para conectar a MongoDB
 */
async function connectMongoDB() {
  try {
    // Descomentar cuando instales mongoose:
    // const mongoose = require('mongoose');
    // await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    // console.log('✅ Conectado a MongoDB');
    console.log('⚠️  Instala mongoose: npm install mongoose');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

/**
 * EJEMPLO: Función para conectar a PostgreSQL
 */
async function connectPostgreSQL() {
  try {
    // Descomentar cuando instales pg:
    // const { Pool } = require('pg');
    // const pool = new Pool(config.postgresql);
    // await pool.query('SELECT NOW()');
    // console.log('✅ Conectado a PostgreSQL');
    console.log('⚠️  Instala pg: npm install pg');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
}

/**
 * Función principal de conexión
 */
async function connectDatabase() {
  const dbType = config.type;
  
  console.log(`🔌 Intentando conectar a base de datos: ${dbType}`);
  
  switch (dbType) {
    case 'mongodb':
      await connectMongoDB();
      break;
    case 'postgresql':
      await connectPostgreSQL();
      break;
    case 'memory':
      console.log('💾 Usando almacenamiento en memoria');
      break;
    default:
      console.warn(`⚠️  Tipo de BD desconocido: ${dbType}`);
  }
}

module.exports = {
  config,
  connectDatabase,
  connectMongoDB,
  connectPostgreSQL
};
