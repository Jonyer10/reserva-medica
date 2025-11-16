/**
 * Configuración de Dependency Injection
 * Inicializa servicios y casos de uso siguiendo inversión de dependencias
 */

// Servicios de infraestructura
import { httpService } from '../../infrastructure/services/HttpService.js';
import { storageService } from '../../infrastructure/services/StorageService.js';

// Adaptadores (implementaciones de repositorios)
import { HttpAuthRepository } from '../../infrastructure/adapters/HttpAuthRepository.js';
import { DemoAuthRepository } from '../../infrastructure/adapters/DemoAuthRepository.js';
import { HttpMedicalAppointmentRepository } from '../../infrastructure/adapters/HttpMedicalAppointmentRepository.js';
import { DemoMedicalAppointmentRepository } from '../../infrastructure/adapters/DemoMedicalAppointmentRepository.js';

// Casos de uso
import { AuthUseCases } from '../../domain/usecases/AuthUseCases.js';
import { MedicalAppointmentUseCases } from '../../domain/usecases/MedicalAppointmentUseCases.js';

/**
 * Configuración de servicios de infraestructura
 * Permite cambiar fácilmente la configuración del entorno
 */
export const configureServices = (config = {}) => {
  const {
    apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout = 10000
  } = config;

  // Configurar servicio HTTP
  httpService.setBaseURL(apiBaseUrl);
  httpService.client.defaults.timeout = timeout;

  return {
    httpService,
    storageService
  };
};

/**
 * Configuración de repositorios
 * Inyecta las dependencias de servicios en los repositorios
 */
export const configureRepositories = (services) => {
  // En modo desarrollo, usar repositorio demo para evitar errores de backend
  const useDemoMode = import.meta.env.MODE === 'development' || !import.meta.env.VITE_API_BASE_URL;
  
  const authRepository = useDemoMode 
    ? new DemoAuthRepository()
    : new HttpAuthRepository(services.httpService);
    
  const appointmentRepository = useDemoMode
    ? new DemoMedicalAppointmentRepository()
    : new HttpMedicalAppointmentRepository(services.httpService);

  return {
    authRepository,
    appointmentRepository
  };
};

/**
 * Configuración de casos de uso
 * Inyecta las dependencias de repositorios en los casos de uso
 */
export const configureUseCases = (repositories, services) => {
  const authUseCases = new AuthUseCases(
    repositories.authRepository,
    services.storageService
  );

  const appointmentUseCases = new MedicalAppointmentUseCases(
    repositories.appointmentRepository
  );

  return {
    authUseCases,
    appointmentUseCases
  };
};

/**
 * Configuración principal de la aplicación
 * Inicializa toda la arquitectura hexagonal
 */
export const configureApplication = (config = {}) => {
  // 1. Configurar servicios de infraestructura
  const services = configureServices(config);

  // 2. Configurar repositorios (puertos -> adaptadores)
  const repositories = configureRepositories(services);

  // 3. Configurar casos de uso (lógica de negocio)
  const useCases = configureUseCases(repositories, services);

  // 4. Configurar interceptores y middleware adicionales
  setupGlobalErrorHandling();
  setupRequestInterceptors(services.httpService);

  return {
    services,
    repositories,
    useCases
  };
};

/**
 * Configuración de manejo global de errores
 */
const setupGlobalErrorHandling = () => {
  // Capturar errores no manejados en promesas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Error no manejado:', event.reason);
    
    // Mostrar notificación al usuario
    showGlobalNotification('Ha ocurrido un error inesperado', 'error');
    
    // Prevenir que se muestre en la consola del navegador
    event.preventDefault();
  });

  // Capturar errores globales de JavaScript
  window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    
    // No mostrar errores de scripts externos o de extensiones
    if (event.filename && !event.filename.includes(window.location.origin)) {
      return;
    }
    
    showGlobalNotification('Ha ocurrido un error técnico', 'error');
  });
};

/**
 * Configuración de interceptores de request
 */
const setupRequestInterceptors = (httpService) => {
  // Interceptor para logging en desarrollo
  if (import.meta.env.MODE === 'development') {
    httpService.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      }
    );

    httpService.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.log(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Interceptor para métricas y analytics
  httpService.client.interceptors.request.use(
    (config) => {
      // Añadir timestamp para métricas
      config.metadata = { startTime: Date.now() };
      return config;
    }
  );

  httpService.client.interceptors.response.use(
    (response) => {
      // Calcular tiempo de respuesta
      const endTime = Date.now();
      const duration = endTime - response.config.metadata?.startTime;
      
      // Enviar métricas (en producción se enviaría a un servicio de analytics)
      if (import.meta.env.MODE === 'production') {
        // analytics.track('api_request', { method, url, duration, status: response.status });
      }
      
      return response;
    },
    (error) => {
      // Tracking de errores
      const endTime = Date.now();
      const duration = endTime - (error.config?.metadata?.startTime || endTime);
      
      if (import.meta.env.MODE === 'production') {
        // analytics.track('api_error', { method, url, duration, status: error.response?.status });
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Función auxiliar para mostrar notificaciones globales
 */
const showGlobalNotification = (message, type = 'info') => {
  // En una implementación real, esto se conectaría con un sistema de notificaciones
  // Por ahora usamos console y eventualmente se puede integrar con react-hot-toast o similar
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Crear evento personalizado para que los componentes puedan escuchar
  window.dispatchEvent(new CustomEvent('globalNotification', {
    detail: { message, type }
  }));
};

/**
 * Función para limpiar configuración (útil para testing)
 */
export const cleanupConfiguration = () => {
  // Limpiar interceptores
  httpService.client.interceptors.request.clear();
  httpService.client.interceptors.response.clear();
  
  // Remover event listeners
  window.removeEventListener('unhandledrejection', () => {});
  window.removeEventListener('error', () => {});
};