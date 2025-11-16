/**
 * Adaptador Demo para el repositorio de autenticación
 * Implementación que simula la autenticación sin backend
 */
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { User } from '../../domain/entities/User.js';
import { demoAuthService } from '../services/DemoAuthService.js';

export class DemoAuthRepository extends IAuthRepository {
  constructor() {
    super();
    this.authService = demoAuthService;
  }

  async login(email, password) {
    try {
      const response = await this.authService.login(email, password);
      
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
      const response = await this.authService.register(userData);
      
      return User.fromPlainObject(response);
    } catch (error) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión:', error.message);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.authService.getCurrentUser();
      
      if (!response) {
        return null;
      }
      
      return User.fromPlainObject(response);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener usuario actual');
    }
  }

  async updateProfile(userData) {
    try {
      const response = await this.authService.updateProfile(userData);
      
      return User.fromPlainObject(response);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  }

  async requestPasswordReset(email) {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Simulando envío de email de reseteo a:', email);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al solicitar reseteo de contraseña');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Simulando reseteo de contraseña con token:', token);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al resetear contraseña');
    }
  }

  async verifyToken(token) {
    try {
      // En modo demo, verificar si existe el token en localStorage
      const savedToken = localStorage.getItem('medical_token');
      return savedToken === token && !!token;
    } catch (error) {
      return false;
    }
  }

  async isAuthenticated() {
    try {
      return await this.authService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}