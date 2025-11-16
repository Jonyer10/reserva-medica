/**
 * Tipos y constantes compartidas para validaciones
 */

// Patrones de validación
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
};

// Mensajes de error estandarizados
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Formato de email inválido',
  INVALID_PHONE: 'Formato de teléfono inválido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  INVALID_NAME: 'El nombre debe tener entre 2 y 50 caracteres y solo contener letras',
  PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
  INVALID_DATE: 'Fecha inválida',
  PAST_DATE: 'La fecha debe ser futura',
  WEEKEND_NOT_ALLOWED: 'No se permiten citas los fines de semana',
  OUTSIDE_BUSINESS_HOURS: 'Horario fuera de atención (8:00 AM - 6:00 PM)',
  CONNECTION_ERROR: 'Error de conexión. Verifica tu internet.',
  SESSION_EXPIRED: 'Sesión expirada. Inicia sesión nuevamente.',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'No tienes permisos para esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Datos inválidos',
  SERVER_ERROR: 'Error interno del servidor',
  APPOINTMENT_TOO_CLOSE: 'No se puede modificar una cita con menos de 2 horas de anticipación',
  APPOINTMENT_NOT_FOUND: 'Cita no encontrada',
  DOCTOR_NOT_AVAILABLE: 'El doctor no está disponible en ese horario',
  SLOT_NOT_AVAILABLE: 'El horario seleccionado ya no está disponible'
};

// Estados de formulario
export const FORM_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configuración de horarios
export const BUSINESS_HOURS = {
  START: 8, // 8:00 AM
  END: 18,  // 6:00 PM
  SLOT_DURATION: 30, // minutos
  BREAK_START: 12, // 12:00 PM
  BREAK_END: 13    // 1:00 PM
};

// Días de la semana
export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  FIRST_PAGE: 1
};

// Configuración de fechas
export const DATE_FORMATS = {
  API: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm'
};

// Configuración de storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  REMEMBER_EMAIL: 'remember_email'
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};