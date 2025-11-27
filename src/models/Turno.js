/**
 * PLANTILLA: Modelo de Entidad
 * 
 * Este es un ejemplo de cómo crear un modelo.
 * Reemplaza "Item" con el nombre de tu entidad.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo (ej: Usuario.js, Producto.js)
 * 2. Modifica los campos según tus necesidades
 * 3. Ajusta los métodos según la lógica de negocio
 */

class Item {
  constructor(data) {
    // ID único (generado automáticamente)
    this.id = data.id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // EJEMPLO: Campos de tu entidad
    this.nombre = data.nombre || '';
    this.descripcion = data.descripcion || '';
    this.estado = data.estado || 'activo'; // activo, inactivo, etc.
    
    // Campos de auditoría
    this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
    this.fechaActualizacion = data.fechaActualizacion || new Date().toISOString();
    
    // NOTA: Agrega más campos según tu necesidad
    // this.precio = data.precio || 0;
    // this.categoria = data.categoria || '';
  }

  /**
   * Convierte la entidad a formato JSON
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion
    };
  }

  /**
   * EJEMPLO: Método para actualizar
   */
  actualizar(nuevosDatos) {
    Object.keys(nuevosDatos).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id') {
        this[key] = nuevosDatos[key];
      }
    });
    this.fechaActualizacion = new Date().toISOString();
  }
}

module.exports = Item;
