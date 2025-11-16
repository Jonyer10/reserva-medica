/**
 * Puerto (Interface) para el repositorio de autenticación
 * Define los contratos que debe cumplir cualquier implementación
 * Aplicando el patrón Repository y principio de inversión de dependencias
 */
export class IAuthRepository {
  /**
   * Inicia sesión con email y contraseña
   * @param {string} _email 
   * @param {string} _password 
   * @returns {Promise<{user: User, token: string}>}
   */
  async login(_email, _password) {
    throw new Error('Method not implemented');
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} _userData 
   * @returns {Promise<User>}
   */
  async register(_userData) {
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
   * @param {Object} _userData 
   * @returns {Promise<User>}
   */
  async updateProfile(_userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Solicita reseteo de contraseña
   * @param {string} _email 
   * @returns {Promise<void>}
   */
  async requestPasswordReset(_email) {
    throw new Error('Method not implemented');
  }

  /**
   * Resetea la contraseña
   * @param {string} _token 
   * @param {string} _newPassword 
   * @returns {Promise<void>}
   */
  async resetPassword(_token, _newPassword) {
    throw new Error('Method not implemented');
  }

  /**
   * Verifica si el token es válido
   * @param {string} _token 
   * @returns {Promise<boolean>}
   */
  async verifyToken(_token) {
    throw new Error('Method not implemented');
  }
}