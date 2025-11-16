/**
 * Puerto (Interface) para el repositorio de autenticación
 * Define los contratos que debe cumplir cualquier implementación
 * Aplicando el patrón Repository y principio de inversión de dependencias
 */
export class IAuthRepository {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: User, token: string}>}
   */
  async login(email, password) {
    throw new Error('Method not implemented');
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData 
   * @returns {Promise<User>}
   */
  async register(userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Cierra sesión del usuario actual
   * @returns {Promise<void>}
   */
  async logout() {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise<User>}
   */
  async getCurrentUser() {
    throw new Error('Method not implemented');
  }

  /**
   * Actualiza el perfil del usuario
   * @param {Object} userData 
   * @returns {Promise<User>}
   */
  async updateProfile(userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Solicita reseteo de contraseña
   * @param {string} email 
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Resetea la contraseña
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<void>}
   */
  async resetPassword(token, newPassword) {
    throw new Error('Method not implemented');
  }

  /**
   * Verifica si el token es válido
   * @param {string} token 
   * @returns {Promise<boolean>}
   */
  async verifyToken(token) {
    throw new Error('Method not implemented');
  }
}