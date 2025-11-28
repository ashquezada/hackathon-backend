const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Configuración de SQLite
 * Base de datos local para desarrollo y producción ligera
 */

const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../../data/visitas.db');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con SQLite:', err.message);
  } else {
    console.log('✅ Conectado a SQLite:', dbPath);
  }
});

/**
 * Inicializar tablas
 * NOTA: Las tablas deben crearse manualmente ejecutando los scripts SQL
 */
const initTables = () => {
  return new Promise((resolve, reject) => {
    console.log('ℹ️  Las tablas deben estar creadas previamente con los scripts SQL');
    resolve();
  });
};

/**
 * Helper para ejecutar consultas con promesas
 */
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Helper para ejecutar INSERT/UPDATE/DELETE
 */
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

/**
 * Helper para obtener un solo registro
 */
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

/**
 * Cerrar conexión
 */
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Conexión SQLite cerrada');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initTables,
  query,
  run,
  get,
  close
};
