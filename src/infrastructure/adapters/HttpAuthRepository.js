/**
 * Adaptador HTTP para el repositorio de autenticación
 * Implementación concreta que comunica con la API REST
 */
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { User } from '../../domain/entities/User.js';

export class HttpAuthRepository extends IAuthRepository {
  constructor(httpService) {
    super();
    this.httpService = httpService;
  }

  async login(email, password) {
    try {
      const response = await this.httpService.post('/auth/login', {
        email,
        password
      });

      const user = User.fromPlainObject(response.user);
      
      return {
        user,
        token: response.token
      };
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  async register(userData) {
    try {
      const response = await this.httpService.post('/auth/register', userData);
      
      return User.fromPlainObject(response.user);
    } catch (error) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  async logout() {
    try {
      await this.httpService.post('/auth/logout');
    } catch (error) {
      // En caso de logout, es aceptable que falle la petición
      console.warn('Error al cerrar sesión en el servidor:', error.message);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.httpService.get('/auth/me');
      
      return User.fromPlainObject(response.user);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener usuario actual');
    }
  }

  async updateProfile(userData) {
    try {
      const response = await this.httpService.put('/auth/profile', userData);
      
      return User.fromPlainObject(response.user);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  }

  async requestPasswordReset(email) {
    try {
      await this.httpService.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(error.message || 'Error al solicitar reseteo de contraseña');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      await this.httpService.post('/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      throw new Error(error.message || 'Error al resetear contraseña');
    }
  }

  async verifyToken(token) {
    try {
      const response = await this.httpService.post('/auth/verify-token', { token });
      
      return response.valid;
    } catch (error) {
      return false;
    }
  }
}