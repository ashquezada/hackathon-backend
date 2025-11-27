/**
 * PLANTILLA: Modelo de Visita
 * 
 * Este es un ejemplo de cómo crear un modelo para gestionar visitas.
 * Puedes personalizar los campos según tus necesidades.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo según tu entidad (ej: Cliente.js, Producto.js)
 * 2. Modifica los campos según tus necesidades
 * 3. Ajusta los métodos según la lógica de negocio
 */

class Visita {
  constructor(data) {
    // ID único (generado automáticamente)
    this.id = data.id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Número de visita secuencial
    this.numero = data.numero || 0;
    
    // CAMPOS PRINCIPALES: Información del visitante
    this.visitante = data.visitante || '';  // Nombre del visitante
    this.documento = data.documento || '';  // DNI/Cédula/Pasaporte
    this.empresa = data.empresa || '';      // Empresa que visita (opcional)
    this.telefono = data.telefono || '';    // Teléfono de contacto
    
    // CAMPOS DE GESTIÓN: Estado de la visita
    this.estado = data.estado || 'esperando'; 
    // Estados posibles:
    // - esperando: Visita registrada, en espera
    // - llamando: Visita siendo llamada
    // - atendiendo: Visita en curso
    // - finalizado: Visita completada
    // - cancelado: Visita cancelada
    
    // CAMPOS ADICIONALES: Información de la visita
    this.motivo = data.motivo || '';        // Motivo de la visita
    this.personaVisitada = data.personaVisitada || '';  // A quién visita
    this.area = data.area || '';            // Área o departamento
    
    // CAMPOS DE SEGUIMIENTO: Fechas y tiempos
    this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
    this.fechaLlamado = data.fechaLlamado || null;
    this.fechaInicio = data.fechaInicio || null;
    this.fechaFinalizacion = data.fechaFinalizacion || null;
    
    // CAMPOS DE GESTIÓN: Información adicional
    this.ubicacion = data.ubicacion || '';   // Sala/Oficina asignada
    this.observaciones = data.observaciones || '';  // Notas adicionales
    
    // NOTA: Agrega más campos según tu necesidad
    // this.fotoBadge = data.fotoBadge || '';
    // this.vehiculo = data.vehiculo || '';
    // this.placa = data.placa || '';
  }

  /**
   * Convierte la visita a formato JSON
   */
  toJSON() {
    return {
      id: this.id,
      numero: this.numero,
      visitante: this.visitante,
      documento: this.documento,
      empresa: this.empresa,
      telefono: this.telefono,
      estado: this.estado,
      motivo: this.motivo,
      personaVisitada: this.personaVisitada,
      area: this.area,
      fechaCreacion: this.fechaCreacion,
      fechaLlamado: this.fechaLlamado,
      fechaInicio: this.fechaInicio,
      fechaFinalizacion: this.fechaFinalizacion,
      ubicacion: this.ubicacion,
      observaciones: this.observaciones
    };
  }

  /**
   * EJEMPLO: Método para actualizar la visita
   */
  actualizar(nuevosDatos) {
    Object.keys(nuevosDatos).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'numero') {
        this[key] = nuevosDatos[key];
      }
    });
  }

  /**
   * EJEMPLO: Método para cambiar estado
   */
  cambiarEstado(nuevoEstado) {
    this.estado = nuevoEstado;
    
    // Actualizar fechas según el estado
    if (nuevoEstado === 'llamando' && !this.fechaLlamado) {
      this.fechaLlamado = new Date().toISOString();
    }
    
    if (nuevoEstado === 'atendiendo' && !this.fechaInicio) {
      this.fechaInicio = new Date().toISOString();
    }
    
    if ((nuevoEstado === 'finalizado' || nuevoEstado === 'cancelado') && !this.fechaFinalizacion) {
      this.fechaFinalizacion = new Date().toISOString();
    }
  }
}

module.exports = Visita;
