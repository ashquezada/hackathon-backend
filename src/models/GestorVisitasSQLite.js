const { query, run, get } = require('../config/sqlite');

class GestorVisitasSQLite {
  
  // Crear nueva visita
  static async crearVisita(datos) {
    console.log("🚀 ~ 7 ~ crearVisita ~ datos:", datos)
    const sql = `
      INSERT INTO visitas (
        id_anfitrion, id_visitante, id_usuario, 
        inicio, fin, motivo, estado, check_in, check_out
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      datos.id_anfitrion,
      datos.id_visita || null,
      datos.id_usuario || null,
      datos.inicio,
      datos.fin,
      datos.motivo,
      datos.estado || 'preautorizado',
      datos.check_in || null,
      datos.check_out || null
    ];
    try {
        const result = await run(sql, params);
        return this.obtenerVisitaPorId(result.lastID);
    } catch (error) {
        console.error("Error al crear visita:", error);
        throw error;
    }
  }

  // Obtener todas las visitas con filtros
  static async obtenerVisitas(filtros = {}) {
    let sql = `
      SELECT v.*, 
             u_anf.nombre as anfitrion_nombre, u_anf.apellido as anfitrion_apellido,
             vis.nombre as visitante_nombre, vis.apellido as visitante_apellido, vis.empresa,
             u_vis.nombre as usuario_nombre, u_vis.apellido as usuario_apellido
      FROM visitas v
      LEFT JOIN usuarios u_anf ON v.id_anfitrion = u_anf.id
      LEFT JOIN visitantes vis ON v.id_visitante = vis.id
      LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros.id_anfitrion) {
      sql += ' AND v.id_anfitrion = ?';
      params.push(filtros.id_anfitrion);
    }
    
    if (filtros.id_visitante) {
      sql += ' AND v.id_visitante = ?';
      params.push(filtros.id_visitante);
    }
    
    if (filtros.fecha) {
      sql += ' AND DATE(v.inicio) = ?';
      params.push(filtros.fecha);
    }

    sql += ' ORDER BY v.inicio DESC';
    
    return await query(sql, params);
  }

  // Obtener visita por ID
  static async obtenerVisitaPorId(id) {
    const sql = `
      SELECT v.*, 
             u_anf.nombre as anfitrion_nombre, u_anf.apellido as anfitrion_apellido,
             vis.nombre as visitante_nombre, vis.apellido as visitante_apellido, vis.empresa,
             u_vis.nombre as usuario_nombre, u_vis.apellido as usuario_apellido
      FROM visitas v
      LEFT JOIN usuarios u_anf ON v.id_anfitrion = u_anf.id
      LEFT JOIN visitantes vis ON v.id_visitante = vis.id
      LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
      WHERE v.id = ?
    `;
    
    return await get(sql, [id]);
  }

  // Registrar check-in
  static async registrarCheckIn(id) {
    const sql = `
      UPDATE visitas 
      SET check_in = datetime('now', 'localtime'),
          estado = 'en_instalaciones'
      WHERE id = ?
    `;
    
    await run(sql, [id]);
    return this.obtenerVisitaPorId(id);
  }

  // Registrar check-out
  static async registrarCheckOut(id) {
    const sql = `
      UPDATE visitas 
      SET check_out = datetime('now', 'localtime'),
          estado = 'salida'
      WHERE id = ?
    `;
    
    await run(sql, [id]);
    return this.obtenerVisitaPorId(id);
  }

  // Cambiar estado de visita
  static async cambiarEstado(id, nuevoEstado) {
    const estadosValidos = ['preautorizado', 'inesperado', 'en_instalaciones', 'aprobado', 'rechazado', 'salida'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    const sql = `
      UPDATE visitas 
      SET estado = ?
      WHERE id = ?
    `;
    
    await run(sql, [nuevoEstado, id]);
    return this.obtenerVisitaPorId(id);
  }

  // Actualizar visita
  static async actualizarVisita(id, datos) {
    const campos = [];
    const params = [];
    
    if (datos.id_anfitrion !== undefined) {
      campos.push('id_anfitrion = ?');
      params.push(datos.id_anfitrion);
    }
    
    if (datos.inicio !== undefined) {
      campos.push('inicio = ?');
      params.push(datos.inicio);
    }
    
    if (datos.fin !== undefined) {
      campos.push('fin = ?');
      params.push(datos.fin);
    }
    
    if (datos.motivo !== undefined) {
      campos.push('motivo = ?');
      params.push(datos.motivo);
    }

    if (datos.estado !== undefined) {
      campos.push('estado = ?');
      params.push(datos.estado);
    }

    if (datos.check_in !== undefined) {
      campos.push('check_in = ?');
      params.push(datos.check_in);
    }

    if (datos.check_out !== undefined) {
      campos.push('check_out = ?');
      params.push(datos.check_out);
    }
    
    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    params.push(id);
    
    const sql = `
      UPDATE visitas 
      SET ${campos.join(', ')}
      WHERE id = ?
    `;
    
    await run(sql, params);
    return this.obtenerVisitaPorId(id);
  }

  // Eliminar visita
  static async eliminarVisita(id) {
    const sql = 'DELETE FROM visitas WHERE id = ?';
    return await run(sql, [id]);
  }

  // Obtener estadísticas
  static async obtenerEstadisticas() {
    const stats = {};
    
    // Total de visitas
    const totalResult = await get('SELECT COUNT(*) as total FROM visitas');
    stats.total = totalResult.total;
    
    // Visitas hoy
    const hoyResult = await get(`
      SELECT COUNT(*) as hoy 
      FROM visitas 
      WHERE DATE(inicio) = DATE('now', 'localtime')
    `);
    stats.hoy = hoyResult.hoy;
    
    // Visitas en curso (con check_in pero sin check_out)
    const enCursoResult = await get(`
      SELECT COUNT(*) as en_curso 
      FROM visitas 
      WHERE check_in IS NOT NULL AND check_out IS NULL
    `);
    stats.enCurso = enCursoResult.en_curso;
    
    // Visitas finalizadas hoy
    const finalizadasHoyResult = await get(`
      SELECT COUNT(*) as finalizadas_hoy 
      FROM visitas 
      WHERE DATE(check_out) = DATE('now', 'localtime')
    `);
    stats.finalizadasHoy = finalizadasHoyResult.finalizadas_hoy;
    
    return stats;
  }

  // Reiniciar sistema (solo para desarrollo)
  static async reiniciarSistema() {
    await run('DELETE FROM visitas');
    return { mensaje: 'Sistema reiniciado correctamente' };
  }
}

module.exports = GestorVisitasSQLite;