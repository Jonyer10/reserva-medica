/**
 * Casos de uso para autenticación
 * Implementa la lógica de negocio independiente de frameworks
 */
export class AuthUseCases {
  constructor(authRepository, storageService) {
    this.authRepository = authRepository;
    this.storageService = storageService;
  }

  /**
   * Caso de uso: Iniciar sesión
   */
  async login(email, password) {
    try {
      // Validaciones de entrada
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!this.isValidEmail(email)) {
        throw new Error('El formato del email no es válido');
      }

      // Llamada al repositorio
      const result = await this.authRepository.login(email, password);
      
      // Persistir token
      await this.storageService.setItem('auth_token', result.token);
      await this.storageService.setItem('user_data', JSON.stringify(result.user.toPlainObject()));

      return result;
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Registrar usuario
   */
  async register(userData) {
    try {
      // Validaciones de entrada
      this.validateUserData(userData);

      // Llamada al repositorio
      const user = await this.authRepository.register(userData);
      
      return user;
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Cerrar sesión
   */
  async logout() {
    try {
      await this.authRepository.logout();
      
      // Limpiar storage local
      await this.storageService.removeItem('auth_token');
      await this.storageService.removeItem('user_data');
    } catch (error) {
      // Aunque falle la llamada al servidor, limpiar datos locales
      await this.storageService.removeItem('auth_token');
      await this.storageService.removeItem('user_data');
      throw new Error(`Error al cerrar sesión: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Obtener usuario actual
   */
  async getCurrentUser() {
    try {
      const token = await this.storageService.getItem('auth_token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const user = await this.authRepository.getCurrentUser();
      
      // Actualizar datos en storage
      await this.storageService.setItem('user_data', JSON.stringify(user.toPlainObject()));
      
      return user;
    } catch (error) {
      // Si el token es inválido, limpiar storage
      await this.storageService.removeItem('auth_token');
      await this.storageService.removeItem('user_data');
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Verificar si hay sesión activa
   */
  async isAuthenticated() {
    try {
      const token = await this.storageService.getItem('auth_token');
      if (!token) return false;

      return await this.authRepository.verifyToken(token);
    } catch (error) {
      return false;
    }
  }

  /**
   * Caso de uso: Actualizar perfil
   */
  async updateProfile(userData) {
    try {
      this.validateUserData(userData);
      
      const updatedUser = await this.authRepository.updateProfile(userData);
      
      // Actualizar datos en storage
      await this.storageService.setItem('user_data', JSON.stringify(updatedUser.toPlainObject()));
      
      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Solicitar reseteo de contraseña
   */
  async requestPasswordReset(email) {
    try {
      if (!email || !this.isValidEmail(email)) {
        throw new Error('Email válido es requerido');
      }

      await this.authRepository.requestPasswordReset(email);
    } catch (error) {
      throw new Error(`Error al solicitar reseteo de contraseña: ${error.message}`);
    }
  }

  /**
   * Validaciones privadas
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUserData(userData) {
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      throw new Error('El apellido debe tener al menos 2 caracteres');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new Error('Email válido es requerido');
    }

    if (userData.phone && !/^\+?[\d\s-()]+$/.test(userData.phone)) {
      throw new Error('Formato de teléfono no válido');
    }
  }
}