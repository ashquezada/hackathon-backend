const { query, run, get } = require('../config/sqlite');

class GestorUsuarios {
  
  // Buscar usuario por ID
  static async buscarPorId(id) {
    const sql = `
      SELECT u.*, 
             p.perfil,
             a.area,
             u_sup.nombre as supervisor_nombre,
             u_sup.apellido as supervisor_apellido
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_perfil = p.id
      LEFT JOIN areas a ON u.id_area = a.id
      LEFT JOIN usuarios u_sup ON u.id_superior = u_sup.id
      WHERE u.id = ?
    `;
    return await get(sql, [id]);
  }

  // Buscar usuario por DNI
  static async buscarPorDNI(dni) {
    const sql = `
      SELECT u.*, 
             p.perfil,
             a.area
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_perfil = p.id
      LEFT JOIN areas a ON u.id_area = a.id
      WHERE u.dni = ?
    `;
    return await get(sql, [dni]);
  }

  // Buscar usuario por email
  static async buscarPorEmail(email) {
    const sql = `
      SELECT u.*, 
             p.perfil,
             a.area
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_perfil = p.id
      LEFT JOIN areas a ON u.id_area = a.id
      WHERE u.email = ?
    `;
    return await get(sql, [email]);
  }

  // Obtener todos los usuarios
  static async obtenerTodos(filtros = {}) {
    let sql = `
      SELECT u.*, 
             p.perfil,
             a.area
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_perfil = p.id
      LEFT JOIN areas a ON u.id_area = a.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filtros.id_perfil) {
      sql += ' AND u.id_perfil = ?';
      params.push(filtros.id_perfil);
    }
    
    if (filtros.id_area) {
      sql += ' AND u.id_area = ?';
      params.push(filtros.id_area);
    }
    
    if (filtros.activo !== undefined) {
      if (filtros.activo) {
        sql += ' AND u.fecha_baja IS NULL';
      } else {
        sql += ' AND u.fecha_baja IS NOT NULL';
      }
    }
    
    sql += ' ORDER BY u.apellido, u.nombre';
    
    return await query(sql, params);
  }

  // Obtener usuarios por perfil
  static async obtenerPorPerfil(idPerfil) {
    const sql = `
      SELECT u.*, a.area
      FROM usuarios u
      LEFT JOIN areas a ON u.id_area = a.id
      WHERE u.id_perfil = ? AND u.fecha_baja IS NULL
      ORDER BY u.apellido, u.nombre
    `;
    return await query(sql, [idPerfil]);
  }

  // Obtener usuarios activos (no dados de baja)
  static async obtenerActivos() {
    const sql = `
      SELECT u.*, 
             p.perfil,
             a.area
      FROM usuarios u
      LEFT JOIN perfiles p ON u.id_perfil = p.id
      LEFT JOIN areas a ON u.id_area = a.id
      WHERE u.fecha_baja IS NULL
      ORDER BY u.apellido, u.nombre
    `;
    return await query(sql);
  }

  // Crear nuevo usuario
  static async crearUsuario(datos) {
    const sql = `
      INSERT INTO usuarios (dni, nombre, apellido, email, id_perfil, id_area, id_superior)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      datos.dni,
      datos.nombre,
      datos.apellido,
      datos.email,
      datos.id_perfil,
      datos.id_area || null,
      datos.id_superior || null
    ];
    
    const result = await run(sql, params);
    return this.buscarPorId(result.lastID);
  }

  // Actualizar usuario
  static async actualizarUsuario(id, datos) {
    const campos = [];
    const params = [];
    
    if (datos.nombre !== undefined) {
      campos.push('nombre = ?');
      params.push(datos.nombre);
    }
    
    if (datos.apellido !== undefined) {
      campos.push('apellido = ?');
      params.push(datos.apellido);
    }
    
    if (datos.email !== undefined) {
      campos.push('email = ?');
      params.push(datos.email);
    }
    
    if (datos.id_perfil !== undefined) {
      campos.push('id_perfil = ?');
      params.push(datos.id_perfil);
    }
    
    if (datos.id_area !== undefined) {
      campos.push('id_area = ?');
      params.push(datos.id_area);
    }
    
    if (datos.id_superior !== undefined) {
      campos.push('id_superior = ?');
      params.push(datos.id_superior);
    }
    
    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    params.push(id);
    
    const sql = `
      UPDATE usuarios 
      SET ${campos.join(', ')}
      WHERE id = ?
    `;
    
    await run(sql, params);
    return this.buscarPorId(id);
  }

  // Dar de baja usuario (soft delete)
  static async darDeBaja(id) {
    const sql = `
      UPDATE usuarios 
      SET fecha_baja = datetime('now', 'localtime')
      WHERE id = ?
    `;
    await run(sql, [id]);
    return this.buscarPorId(id);
  }

  // Reactivar usuario
  static async reactivar(id) {
    const sql = `
      UPDATE usuarios 
      SET fecha_baja = NULL
      WHERE id = ?
    `;
    await run(sql, [id]);
    return this.buscarPorId(id);
  }

  // Contar usuarios
  static async contarUsuarios(filtros = {}) {
    let sql = 'SELECT COUNT(*) as total FROM usuarios WHERE 1=1';
    const params = [];
    
    if (filtros.id_perfil) {
      sql += ' AND id_perfil = ?';
      params.push(filtros.id_perfil);
    }
    
    if (filtros.activo !== undefined) {
      if (filtros.activo) {
        sql += ' AND fecha_baja IS NULL';
      } else {
        sql += ' AND fecha_baja IS NOT NULL';
      }
    }
    
    const result = await get(sql, params);
    return result.total;
  }
}

module.exports = GestorUsuarios;
