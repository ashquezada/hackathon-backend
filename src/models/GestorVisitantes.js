const { query, run, get } = require('../config/sqlite');

class GestorVisitantes {
  
  // Crear o actualizar visitante (UPSERT)
  static async crearVisitante(datos) {
    console.log("🚀 ~ 7 ~ crearVisitante ~ datos:", datos)
    const sql = `
      INSERT INTO visitantes (dni, nombre, apellido, email, empresa)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(dni) DO UPDATE SET
        nombre = excluded.nombre,
        apellido = excluded.apellido,
        email = excluded.email,
        empresa = excluded.empresa,
        updated_at = CURRENT_TIMESTAMP
    `;

    const params = [
      datos.dni,
      datos.nombre,
      datos.apellido,
      datos.email,
      datos.empresa || null
    ];

    const result = await run(sql, params);
    return this.buscarPorDNI(datos.dni);
  }

  // Buscar visitante por DNI
  static async buscarPorDNI(dni) {
    const sql = 'SELECT * FROM visitantes WHERE dni = ?';
    return await get(sql, [dni]);
  }

  // Buscar visitante por ID
  static async buscarPorId(id) {
    const sql = 'SELECT * FROM visitantes WHERE id = ?';
    return await get(sql, [id]);
  }

  // Obtener todos los visitantes
  static async obtenerTodos(filtros = {}) {
    let sql = 'SELECT * FROM visitantes WHERE 1=1';
    const params = [];

    if (filtros.empresa) {
      sql += ' AND empresa LIKE ?';
      params.push(`%${filtros.empresa}%`);
    }

    if (filtros.nombre) {
      sql += ' AND (nombre LIKE ? OR apellido LIKE ?)';
      params.push(`%${filtros.nombre}%`, `%${filtros.nombre}%`);
    }

    sql += ' ORDER BY apellido, nombre';

    return await query(sql, params);
  }

  // Eliminar visitante
  static async eliminarVisitante(id) {
    const sql = 'DELETE FROM visitantes WHERE id = ?';
    return await run(sql, [id]);
  }

  // Obtener historial de visitas de un visitante
  static async obtenerHistorialVisitas(dni) {
    const sql = `
      SELECT v.*, 
             u.nombre as anfitrion_nombre, 
             u.apellido as anfitrion_apellido
      FROM visitas v
      INNER JOIN visitantes vis ON v.id_visitante = vis.id
      INNER JOIN usuarios u ON v.id_anfitrion = u.id
      WHERE vis.dni = ?
      ORDER BY v.inicio DESC
    `;

    return await query(sql, [dni]);
  }

  // Obtener visitantes frecuentes (más de N visitas)
  static async obtenerVisitantesFrecuentes(minVisitas = 3) {
    const sql = `
      SELECT vis.*, COUNT(v.id) as total_visitas
      FROM visitantes vis
      INNER JOIN visitas v ON v.id_visitante = vis.id
      GROUP BY vis.id
      HAVING COUNT(v.id) >= ?
      ORDER BY total_visitas DESC
    `;

    return await query(sql, [minVisitas]);
  }
}

module.exports = GestorVisitantes;
