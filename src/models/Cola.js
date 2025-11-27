const Item = require('./Item');

/**
 * PLANTILLA: Repositorio/Store en Memoria
 * 
 * Este es un ejemplo de cómo gestionar datos en memoria.
 * Para producción, reemplaza esto con conexión a base de datos real.
 * 
 * INSTRUCCIONES:
 * 1. Importa tu modelo personalizado
 * 2. Implementa métodos CRUD según tu lógica
 * 3. Para DB real, reemplaza el array con queries de DB
 */

class DataStore {
  constructor() {
    // Almacenamiento en memoria (temporal)
    this.items = [];
  }

  /**
   * PLANTILLA: Crear nuevo item
   */
  crear(datos = {}) {
    const nuevoItem = new Item(datos);
    this.items.push(nuevoItem);
    return nuevoItem;
  }

  /**
   * PLANTILLA: Obtener todos los items con filtro opcional
   */
  obtenerTodos(filtro = {}) {
    let itemsFiltrados = [...this.items];

    // EJEMPLO: Filtrar por estado
    if (filtro.estado) {
      itemsFiltrados = itemsFiltrados.filter(item => item.estado === filtro.estado);
    }

    // EJEMPLO: Filtrar por nombre (búsqueda parcial)
    if (filtro.nombre) {
      itemsFiltrados = itemsFiltrados.filter(item => 
        item.nombre.toLowerCase().includes(filtro.nombre.toLowerCase())
      );
    }

    return itemsFiltrados.map(item => item.toJSON());
  }

  /**
   * PLANTILLA: Obtener un item por ID
   */
  obtenerPorId(id) {
    const item = this.items.find(i => i.id === id);
    return item ? item.toJSON() : null;
  }

  /**
   * PLANTILLA: Actualizar un item
   */
  actualizar(id, nuevosDatos) {
    const item = this.items.find(i => i.id === id);
    
    if (!item) {
      return null;
    }

    item.actualizar(nuevosDatos);
    return item.toJSON();
  }

  /**
   * PLANTILLA: Eliminar un item
   */
  eliminar(id) {
    const index = this.items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return null;
    }

    const itemEliminado = this.items[index];
    this.items.splice(index, 1);
    return itemEliminado.toJSON();
  }

  /**
   * PLANTILLA: Contar items
   */
  contar(filtro = {}) {
    return this.obtenerTodos(filtro).length;
  }

  /**
   * PLANTILLA: Limpiar todo (útil para testing)
   */
  limpiar() {
    this.items = [];
  }
}

// Singleton - instancia única del store
const dataStoreInstance = new DataStore();

module.exports = dataStoreInstance;
