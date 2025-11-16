/**
 * Servicio de Storage Local
 * Maneja la persistencia de datos en el navegador con fallbacks
 */
class LocalStorageService {
  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (_e) {
      return false;
    }
  }

  async setItem(key, value) {
    try {
      if (!this.isAvailable) {
        console.warn('LocalStorage no está disponible');
        return;
      }

      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      throw new Error(`No se pudo guardar ${key}`);
    }
  }

  async getItem(key) {
    try {
      if (!this.isAvailable) {
        return null;
      }

      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error leyendo de localStorage:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      if (!this.isAvailable) {
        return;
      }

      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  async clear() {
    try {
      if (!this.isAvailable) {
        return;
      }

      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  // Método para obtener múltiples elementos
  async getMultiple(keys) {
    const result = {};
    
    for (const key of keys) {
      result[key] = await this.getItem(key);
    }
    
    return result;
  }

  // Método para establecer múltiples elementos
  async setMultiple(items) {
    for (const [key, value] of Object.entries(items)) {
      await this.setItem(key, value);
    }
  }

  // Método para verificar si existe una clave
  hasItem(key) {
    if (!this.isAvailable) return false;
    return localStorage.getItem(key) !== null;
  }

  // Método para obtener el tamaño aproximado del storage
  getStorageSize() {
    if (!this.isAvailable) return 0;
    
    let size = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  // Método para obtener todas las claves
  getKeys() {
    if (!this.isAvailable) return [];
    return Object.keys(localStorage);
  }
}

// Singleton pattern
export const storageService = new LocalStorageService();

export default LocalStorageService;