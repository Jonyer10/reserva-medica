/**
 * Utilitarios compartidos para validaciones y formateo
 */
import { VALIDATION_PATTERNS, ERROR_MESSAGES, WEEKDAYS, BUSINESS_HOURS } from '../types/constants.js';

/**
 * Validaciones de entrada
 */
export const validators = {
  // Valida email
  isValidEmail(email) {
    if (!email) return false;
    return VALIDATION_PATTERNS.EMAIL.test(email);
  },

  // Valida teléfono
  isValidPhone(phone) {
    if (!phone) return false;
    return VALIDATION_PATTERNS.PHONE.test(phone);
  },

  // Valida contraseña segura
  isValidPassword(password) {
    if (!password) return false;
    return VALIDATION_PATTERNS.PASSWORD.test(password);
  },

  // Valida nombre
  isValidName(name) {
    if (!name) return false;
    return VALIDATION_PATTERNS.NAME.test(name.trim());
  },

  // Valida fecha futura
  isFutureDate(date) {
    const inputDate = new Date(date);
    const now = new Date();
    return inputDate > now;
  },

  // Valida día laborable
  isBusinessDay(date) {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek !== WEEKDAYS.SUNDAY && dayOfWeek !== WEEKDAYS.SATURDAY;
  },

  // Valida horario de atención
  isBusinessHour(date) {
    const hour = new Date(date).getHours();
    return hour >= BUSINESS_HOURS.START && hour < BUSINESS_HOURS.END;
  },

  // Valida edad mínima
  isMinAge(birthDate, minAge = 18) {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  }
};

/**
 * Funciones de formateo
 */
export const formatters = {
  // Formatea fecha para mostrar
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return new Date(date).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
  },

  // Formatea fecha y hora
  formatDateTime(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleString('es-ES', { ...defaultOptions, ...options });
  },

  // Formatea hora
  formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatea teléfono
  formatPhone(phone) {
    if (!phone) return '';
    
    // Elimina caracteres no numéricos excepto +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Formato básico para números mexicanos
    if (cleaned.startsWith('+52') && cleaned.length === 13) {
      return `+52 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 9)} ${cleaned.substring(9)}`;
    }
    
    return phone;
  },

  // Formatea nombre (capitaliza primera letra de cada palabra)
  formatName(name) {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Formatea especialidad médica
  formatSpecialty(specialty) {
    const specialties = {
      'general_medicine': 'Medicina General',
      'cardiology': 'Cardiología',
      'dermatology': 'Dermatología',
      'orthopedics': 'Traumatología',
      'pediatrics': 'Pediatría',
      'gynecology': 'Ginecología',
      'psychiatry': 'Psiquiatría',
      'ophthalmology': 'Oftalmología'
    };
    
    return specialties[specialty] || specialty;
  },

  // Formatea estado de cita
  formatAppointmentStatus(status) {
    const statuses = {
      'scheduled': 'Programada',
      'confirmed': 'Confirmada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada',
      'rescheduled': 'Reagendada'
    };
    
    return statuses[status] || status;
  }
};

/**
 * Utilitarios de fecha
 */
export const dateUtils = {
  // Obtiene la fecha actual en formato ISO
  getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  },

  // Añade días a una fecha
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Obtiene el inicio del día
  startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },

  // Obtiene el final del día
  endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },

  // Verifica si es el mismo día
  isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
  },

  // Obtiene los próximos días laborables
  getNextBusinessDays(startDate, count = 7) {
    const days = [];
    let current = new Date(startDate);
    
    while (days.length < count) {
      if (validators.isBusinessDay(current)) {
        days.push(new Date(current));
      }
      current = this.addDays(current, 1);
    }
    
    return days;
  },

  // Genera slots de tiempo para un día
  generateTimeSlots(date, duration = 30) {
    const slots = [];
    const start = BUSINESS_HOURS.START * 60; // minutos desde medianoche
    const end = BUSINESS_HOURS.END * 60;
    const breakStart = BUSINESS_HOURS.BREAK_START * 60;
    const breakEnd = BUSINESS_HOURS.BREAK_END * 60;
    
    for (let minutes = start; minutes < end; minutes += duration) {
      // Saltar horario de almuerzo
      if (minutes >= breakStart && minutes < breakEnd) {
        continue;
      }
      
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      slots.push(timeString);
    }
    
    return slots;
  }
};

/**
 * Utilitarios de validación de formularios
 */
export const formValidators = {
  // Valida formulario de login
  validateLoginForm(email, password) {
    const errors = {};
    
    if (!email) {
      errors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isValidEmail(email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    if (!password) {
      errors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Valida formulario de registro
  validateRegisterForm(formData) {
    const errors = {};
    
    if (!formData.firstName) {
      errors.firstName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isValidName(formData.firstName)) {
      errors.firstName = ERROR_MESSAGES.INVALID_NAME;
    }
    
    if (!formData.lastName) {
      errors.lastName = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isValidName(formData.lastName)) {
      errors.lastName = ERROR_MESSAGES.INVALID_NAME;
    }
    
    if (!formData.email) {
      errors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isValidEmail(formData.email)) {
      errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    if (!formData.password) {
      errors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isValidPassword(formData.password)) {
      errors.password = ERROR_MESSAGES.INVALID_PASSWORD;
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
    }
    
    if (formData.phone && !validators.isValidPhone(formData.phone)) {
      errors.phone = ERROR_MESSAGES.INVALID_PHONE;
    }
    
    if (formData.dateOfBirth && !validators.isMinAge(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Debes ser mayor de 18 años';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Valida formulario de cita
  validateAppointmentForm(formData) {
    const errors = {};
    
    if (!formData.specialty) {
      errors.specialty = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    
    if (!formData.doctorId) {
      errors.doctorId = 'Selecciona un doctor';
    }
    
    if (!formData.date) {
      errors.date = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!validators.isFutureDate(formData.date)) {
      errors.date = ERROR_MESSAGES.PAST_DATE;
    } else if (!validators.isBusinessDay(formData.date)) {
      errors.date = ERROR_MESSAGES.WEEKEND_NOT_ALLOWED;
    }
    
    if (!formData.time) {
      errors.time = 'Selecciona un horario';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

/**
 * Utilitarios de manejo de errores
 */
export const errorUtils = {
  // Obtiene mensaje de error amigable
  getErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    return 'Ha ocurrido un error inesperado';
  },

  // Convierte error de API a formato estándar
  normalizeApiError(error) {
    return {
      message: this.getErrorMessage(error),
      status: error?.response?.status || 0,
      code: error?.response?.data?.code || 'UNKNOWN_ERROR'
    };
  }
};