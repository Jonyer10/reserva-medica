/**
 * Casos de uso para gestión de citas médicas
 * Implementa la lógica de negocio para el manejo de citas
 */
import { MedicalAppointment } from '../entities/MedicalAppointment.js';

export class MedicalAppointmentUseCases {
  constructor(appointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  /**
   * Caso de uso: Obtener citas próximas del usuario
   */
  async getUpcomingAppointments(userId, days = 30) {
    try {
      if (!userId) {
        throw new Error('ID de usuario es requerido');
      }

      const appointments = await this.appointmentRepository.getUpcomingAppointments(userId, days);
      
      // Ordenar por fecha
      return appointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    } catch (error) {
      throw new Error(`Error al obtener citas próximas: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Obtener todas las citas del usuario
   */
  async getUserAppointments(userId) {
    try {
      if (!userId) {
        throw new Error('ID de usuario es requerido');
      }

      const appointments = await this.appointmentRepository.getUserAppointments(userId);
      
      // Ordenar por fecha descendente (más recientes primero)
      return appointments.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } catch (error) {
      throw new Error(`Error al obtener citas del usuario: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Cancelar cita médica
   */
  async cancelAppointment(appointmentId, userId) {
    try {
      if (!appointmentId) {
        throw new Error('ID de cita es requerido');
      }

      // Obtener la cita para validaciones
      const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
      
      // Verificar que pertenece al usuario
      if (appointment.patientId !== userId) {
        throw new Error('No tienes permisos para cancelar esta cita');
      }

      // Verificar que se puede cancelar
      if (!appointment.canBeCancelled()) {
        throw new Error('Esta cita no puede ser cancelada. Debe hacerse con al menos 2 horas de anticipación.');
      }

      // Cancelar la cita
      await this.appointmentRepository.cancelAppointment(appointmentId);
      
      return { success: true, message: 'Cita cancelada exitosamente' };
    } catch (error) {
      throw new Error(`Error al cancelar cita: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Reagendar cita médica
   */
  async rescheduleAppointment(appointmentId, newDateTime, userId) {
    try {
      if (!appointmentId || !newDateTime) {
        throw new Error('ID de cita y nueva fecha son requeridos');
      }

      const newDate = new Date(newDateTime);
      
      // Validar que la nueva fecha es futura
      if (newDate <= new Date()) {
        throw new Error('La nueva fecha debe ser futura');
      }

      // Obtener la cita para validaciones
      const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);
      
      // Verificar que pertenece al usuario
      if (appointment.patientId !== userId) {
        throw new Error('No tienes permisos para reagendar esta cita');
      }

      // Verificar que se puede reagendar
      if (!appointment.canBeRescheduled()) {
        throw new Error('Esta cita no puede ser reagendada. Debe hacerse con al menos 2 horas de anticipación.');
      }

      // Reagendar la cita
      const rescheduledAppointment = await this.appointmentRepository.rescheduleAppointment(
        appointmentId, 
        newDate
      );
      
      return {
        success: true,
        message: 'Cita reagendada exitosamente',
        appointment: rescheduledAppointment
      };
    } catch (error) {
      throw new Error(`Error al reagendar cita: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Crear nueva cita médica
   */
  async createAppointment(appointmentData, userId) {
    try {
      this.validateAppointmentData(appointmentData);

      const appointmentDataWithUser = {
        ...appointmentData,
        patientId: userId,
        status: MedicalAppointment.STATUS.SCHEDULED
      };

      // Verificar disponibilidad del doctor
      const availableSlots = await this.appointmentRepository.getAvailableTimeSlots(
        appointmentData.doctorId,
        new Date(appointmentData.dateTime)
      );

      const requestedTime = new Date(appointmentData.dateTime).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      if (!availableSlots.includes(requestedTime)) {
        throw new Error('El horario seleccionado no está disponible');
      }

      const appointment = await this.appointmentRepository.createAppointment(appointmentDataWithUser);
      
      return {
        success: true,
        message: 'Cita creada exitosamente',
        appointment
      };
    } catch (error) {
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Obtener doctores disponibles
   */
  async getAvailableDoctors(specialty, date) {
    try {
      if (!specialty || !date) {
        throw new Error('Especialidad y fecha son requeridas');
      }

      const searchDate = new Date(date);
      
      // Validar que la fecha es futura
      if (searchDate < new Date()) {
        throw new Error('La fecha debe ser futura');
      }

      const doctors = await this.appointmentRepository.getAvailableDoctors(specialty, searchDate);
      
      return doctors.filter(doctor => doctor.isAvailable);
    } catch (error) {
      throw new Error(`Error al obtener doctores disponibles: ${error.message}`);
    }
  }

  /**
   * Caso de uso: Obtener horarios disponibles
   */
  async getAvailableTimeSlots(doctorId, date) {
    try {
      if (!doctorId || !date) {
        throw new Error('ID de doctor y fecha son requeridos');
      }

      const searchDate = new Date(date);
      
      // Validar que la fecha es futura
      if (searchDate < new Date()) {
        throw new Error('La fecha debe ser futura');
      }

      return await this.appointmentRepository.getAvailableTimeSlots(doctorId, searchDate);
    } catch (error) {
      throw new Error(`Error al obtener horarios disponibles: ${error.message}`);
    }
  }

  /**
   * Validaciones privadas
   */
  validateAppointmentData(appointmentData) {
    if (!appointmentData.doctorId) {
      throw new Error('Doctor es requerido');
    }

    if (!appointmentData.dateTime) {
      throw new Error('Fecha y hora son requeridas');
    }

    if (!appointmentData.specialty) {
      throw new Error('Especialidad es requerida');
    }

    const appointmentDate = new Date(appointmentData.dateTime);
    if (appointmentDate <= new Date()) {
      throw new Error('La fecha de la cita debe ser futura');
    }

    // Validar que no sea un domingo (ejemplo de regla de negocio)
    if (appointmentDate.getDay() === 0) {
      throw new Error('No se pueden agendar citas los domingos');
    }

    // Validar horario de atención (8 AM - 6 PM)
    const hour = appointmentDate.getHours();
    if (hour < 8 || hour >= 18) {
      throw new Error('Las citas solo se pueden agendar entre 8:00 AM y 6:00 PM');
    }
  }
}