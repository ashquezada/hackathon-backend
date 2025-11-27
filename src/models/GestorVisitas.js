const Visita = require('./Visita');

/**
 * PLANTILLA: Gestor de Visitas en Memoria
 * 
 * Este es un ejemplo de cómo gestionar visitas en memoria.
 * Para producción, reemplaza esto con conexión a base de datos real.
 * 
 * INSTRUCCIONES:
 * 1. Para usar con MongoDB: Reemplaza con Mongoose
 * 2. Para usar con PostgreSQL: Reemplaza con queries SQL
 * 3. Este store es útil para desarrollo y pruebas
 */

class GestorVisitas {
  constructor() {
    // Almacenamiento en memoria (temporal)
    this.visitas = [];
    this.ultimoNumero = 0; // Contador secuencial
  }

  /**
   * PLANTILLA: Crear nueva visita
   */
  crear(datos = {}) {
    // Incrementar número secuencial
    this.ultimoNumero++;
    datos.numero = this.ultimoNumero;
    
    const nuevaVisita = new Visita(datos);
    this.visitas.push(nuevaVisita);
    return nuevaVisita;
  }

  /**
   * PLANTILLA: Obtener todas las visitas con filtro opcional
   */
  obtenerTodas(filtro = {}) {
    let visitasFiltradas = [...this.visitas];

    // EJEMPLO: Filtrar por estado
    if (filtro.estado) {
      visitasFiltradas = visitasFiltradas.filter(v => v.estado === filtro.estado);
    }

    // EJEMPLO: Filtrar por visitante (búsqueda parcial)
    if (filtro.visitante) {
      visitasFiltradas = visitasFiltradas.filter(v => 
        v.visitante.toLowerCase().includes(filtro.visitante.toLowerCase())
      );
    }

    // EJEMPLO: Filtrar por empresa
    if (filtro.empresa) {
      visitasFiltradas = visitasFiltradas.filter(v => 
        v.empresa.toLowerCase().includes(filtro.empresa.toLowerCase())
      );
    }

    // EJEMPLO: Filtrar por área
    if (filtro.area) {
      visitasFiltradas = visitasFiltradas.filter(v => 
        v.area.toLowerCase().includes(filtro.area.toLowerCase())
      );
    }

    // EJEMPLO: Filtrar por persona visitada
    if (filtro.personaVisitada) {
      visitasFiltradas = visitasFiltradas.filter(v => 
        v.personaVisitada.toLowerCase().includes(filtro.personaVisitada.toLowerCase())
      );
    }

    // Ordenar por número de visita (más recientes primero)
    visitasFiltradas.sort((a, b) => b.numero - a.numero);

    return visitasFiltradas.map(v => v.toJSON());
  }

  /**
   * PLANTILLA: Obtener una visita por ID
   */
  obtenerPorId(id) {
    const visita = this.visitas.find(v => v.id === id);
    return visita ? visita.toJSON() : null;
  }

  /**
   * PLANTILLA: Obtener siguiente visita en espera
   */
  obtenerSiguiente() {
    const enEspera = this.visitas
      .filter(v => v.estado === 'esperando')
      .sort((a, b) => a.numero - b.numero); // Ordenar por número ascendente
    
    return enEspera.length > 0 ? enEspera[0].toJSON() : null;
  }

  /**
   * PLANTILLA: Actualizar una visita
   */
  actualizar(id, nuevosDatos) {
    const visita = this.visitas.find(v => v.id === id);
    
    if (!visita) {
      return null;
    }

    // Si se cambia el estado, usar el método cambiarEstado
    if (nuevosDatos.estado && nuevosDatos.estado !== visita.estado) {
      visita.cambiarEstado(nuevosDatos.estado);
      delete nuevosDatos.estado; // Ya se manejó
    }

    visita.actualizar(nuevosDatos);
    return visita.toJSON();
  }

  /**
   * PLANTILLA: Eliminar/Cancelar una visita
   */
  eliminar(id) {
    const index = this.visitas.findIndex(v => v.id === id);
    
    if (index === -1) {
      return null;
    }

    const visitaEliminada = this.visitas[index];
    this.visitas.splice(index, 1);
    return visitaEliminada.toJSON();
  }

  /**
   * PLANTILLA: Contar visitas
   */
  contar(filtro = {}) {
    return this.obtenerTodas(filtro).length;
  }

  /**
   * PLANTILLA: Obtener estadísticas
   */
  obtenerEstadisticas() {
    return {
      total: this.visitas.length,
      esperando: this.contar({ estado: 'esperando' }),
      llamando: this.contar({ estado: 'llamando' }),
      atendiendo: this.contar({ estado: 'atendiendo' }),
      finalizados: this.contar({ estado: 'finalizado' }),
      cancelados: this.contar({ estado: 'cancelado' }),
      ultimoNumero: this.ultimoNumero
    };
  }

  /**
   * PLANTILLA: Reiniciar sistema (útil para testing o nuevo día)
   */
  reiniciar() {
    this.visitas = [];
    this.ultimoNumero = 0;
  }

  /**
   * PLANTILLA: Limpiar visitas antiguas (solo mantener activas)
   */
  limpiarFinalizadas() {
    this.visitas = this.visitas.filter(v => 
      v.estado !== 'finalizado' && v.estado !== 'cancelado'
    );
  }
}

// Singleton - instancia única del gestor
const gestorVisitasInstance = new GestorVisitas();

module.exports = gestorVisitasInstance;
