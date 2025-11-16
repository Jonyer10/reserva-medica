/**
 * Adaptador Demo para el repositorio de citas médicas
 * Implementación que simula citas sin backend
 */
import { IMedicalAppointmentRepository } from '../../domain/repositories/IMedicalAppointmentRepository.js';
import { MedicalAppointment } from '../../domain/entities/MedicalAppointment.js';
import { demoAppointmentService } from '../services/DemoAppointmentService.js';

export class DemoMedicalAppointmentRepository extends IMedicalAppointmentRepository {
  constructor() {
    super();
    this.appointmentService = demoAppointmentService;
  }

  async getUserAppointments(userId, limit = 10) {
    try {
      const appointments = await this.appointmentService.getUserAppointments(userId, limit);
      return appointments.map(apt => MedicalAppointment.fromPlainObject(apt));
    } catch (error) {
      throw new Error(error.message || 'Error al obtener citas del usuario');
    }
  }

  async getUpcomingAppointments(userId, days = 30) {
    try {
      const appointments = await this.appointmentService.getUpcomingAppointments(userId, days);
      return appointments.map(apt => MedicalAppointment.fromPlainObject(apt));
    } catch (error) {
      throw new Error(error.message || 'Error al obtener próximas citas');
    }
  }

  async createAppointment(appointmentData, userId) {
    try {
      const result = await this.appointmentService.createAppointment(appointmentData, userId);
      
      return {
        ...result,
        appointment: MedicalAppointment.fromPlainObject(result.appointment)
      };
    } catch (error) {
      throw new Error(error.message || 'Error al crear cita');
    }
  }

  async updateAppointment(appointmentId, appointmentData, userId) {
    try {
      // Para demo, implementamos una actualización básica
      const result = await this.appointmentService.rescheduleAppointment(
        appointmentId, 
        appointmentData.dateTime, 
        userId
      );
      
      return {
        ...result,
        appointment: MedicalAppointment.fromPlainObject(result.appointment)
      };
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar cita');
    }
  }

  async cancelAppointment(appointmentId, userId) {
    try {
      return await this.appointmentService.cancelAppointment(appointmentId, userId);
    } catch (error) {
      throw new Error(error.message || 'Error al cancelar cita');
    }
  }

  async rescheduleAppointment(appointmentId, newDateTime, userId) {
    try {
      const result = await this.appointmentService.rescheduleAppointment(
        appointmentId, 
        newDateTime, 
        userId
      );
      
      return {
        ...result,
        appointment: MedicalAppointment.fromPlainObject(result.appointment)
      };
    } catch (error) {
      throw new Error(error.message || 'Error al reagendar cita');
    }
  }

  async getAvailableDoctors(specialty, date) {
    try {
      return await this.appointmentService.getAvailableDoctors(specialty, date);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener doctores disponibles');
    }
  }

  async getAvailableTimeSlots(doctorId, date) {
    try {
      return await this.appointmentService.getAvailableTimeSlots(doctorId, date);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener horarios disponibles');
    }
  }

  async getAppointmentById(appointmentId, userId) {
    try {
      const userAppointments = await this.appointmentService.getUserAppointments(userId, 100);
      const appointment = userAppointments.find(apt => apt.id === appointmentId);
      
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }
      
      return MedicalAppointment.fromPlainObject(appointment);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener cita');
    }
  }

  async getAppointmentsByDateRange(userId, startDate, endDate) {
    try {
      const allAppointments = await this.appointmentService.getUserAppointments(userId, 100);
      
      const filtered = allAppointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return aptDate >= start && aptDate <= end;
      });
      
      return filtered.map(apt => MedicalAppointment.fromPlainObject(apt));
    } catch (error) {
      throw new Error(error.message || 'Error al obtener citas por rango de fecha');
    }
  }

  async confirmAppointment(appointmentId, userId) {
    try {
      // Para demo, simulamos confirmación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        message: 'Cita confirmada exitosamente'
      };
    } catch (error) {
      throw new Error(error.message || 'Error al confirmar cita');
    }
  }
}