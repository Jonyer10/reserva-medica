/**
 * Servicio HTTP para comunicación con APIs
 * Implementa manejo de errores, interceptors y configuración base
 */
import axios from 'axios';

class HttpService {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - añade token a todas las peticiones
    this.client.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejo global de errores
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (no autorizado) y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Limpiar datos de autenticación
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          
          // Redirigir al login si estamos en el navegador
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  handleError(error) {
    const errorResponse = {
      message: 'Error de conexión',
      status: 0,
      data: null
    };

    if (error.response) {
      // El servidor respondió con un código de error
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
      
      switch (error.response.status) {
        case 400:
          errorResponse.message = error.response.data?.message || 'Solicitud inválida';
          break;
        case 401:
          errorResponse.message = 'No autorizado. Inicia sesión nuevamente.';
          break;
        case 403:
          errorResponse.message = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorResponse.message = 'Recurso no encontrado';
          break;
        case 422:
          errorResponse.message = error.response.data?.message || 'Datos de entrada inválidos';
          break;
        case 500:
          errorResponse.message = 'Error interno del servidor';
          break;
        default:
          errorResponse.message = error.response.data?.message || `Error ${error.response.status}`;
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      errorResponse.message = 'Error de conexión. Verifica tu conexión a internet.';
    } else {
      // Error en la configuración de la petición
      errorResponse.message = error.message || 'Error desconocido';
    }

    return errorResponse;
  }

  // Métodos HTTP
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar la URL base (útil para diferentes entornos)
  setBaseURL(baseURL) {
    this.client.defaults.baseURL = baseURL;
  }

  // Método para configurar headers personalizados
  setDefaultHeader(key, value) {
    this.client.defaults.headers.common[key] = value;
  }
}

// Singleton pattern - una sola instancia del servicio HTTP
export const httpService = new HttpService();

export default HttpService;