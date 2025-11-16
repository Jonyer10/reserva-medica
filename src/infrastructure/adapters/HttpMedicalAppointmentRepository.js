/**
 * Adaptador HTTP para el repositorio de citas médicas
 * Implementación concreta que comunica con la API REST
 */
import { IMedicalAppointmentRepository } from '../../domain/repositories/IMedicalAppointmentRepository.js';
import { MedicalAppointment } from '../../domain/entities/MedicalAppointment.js';
import { Doctor } from '../../domain/entities/Doctor.js';

export class HttpMedicalAppointmentRepository extends IMedicalAppointmentRepository {
  constructor(httpService) {
    super();
    this.httpService = httpService;
  }

  async getUserAppointments(userId) {
    try {
      const response = await this.httpService.get(`/appointments/user/${userId}`);
      
      return response.appointments.map(apt => 
        MedicalAppointment.fromPlainObject(apt)
      );
    } catch (error) {
      throw new Error(error.message || 'Error al obtener citas del usuario');
    }
  }

  async getAppointmentById(appointmentId) {
    try {
      const response = await this.httpService.get(`/appointments/${appointmentId}`);
      
      return MedicalAppointment.fromPlainObject(response.appointment);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener la cita');
    }
  }

  async createAppointment(appointmentData) {
    try {
      const response = await this.httpService.post('/appointments', appointmentData);
      
      return MedicalAppointment.fromPlainObject(response.appointment);
    } catch (error) {
      throw new Error(error.message || 'Error al crear la cita');
    }
  }

  async updateAppointment(appointmentId, appointmentData) {
    try {
      const response = await this.httpService.put(
        `/appointments/${appointmentId}`, 
        appointmentData
      );
      
      return MedicalAppointment.fromPlainObject(response.appointment);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar la cita');
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      await this.httpService.patch(`/appointments/${appointmentId}/cancel`);
    } catch (error) {
      throw new Error(error.message || 'Error al cancelar la cita');
    }
  }

  async rescheduleAppointment(appointmentId, newDateTime) {
    try {
      const response = await this.httpService.patch(
        `/appointments/${appointmentId}/reschedule`,
        { newDateTime: newDateTime.toISOString() }
      );
      
      return MedicalAppointment.fromPlainObject(response.appointment);
    } catch (error) {
      throw new Error(error.message || 'Error al reagendar la cita');
    }
  }

  async getUpcomingAppointments(userId, days = 30) {
    try {
      const response = await this.httpService.get(
        `/appointments/user/${userId}/upcoming`,
        { params: { days } }
      );
      
      return response.appointments.map(apt => 
        MedicalAppointment.fromPlainObject(apt)
      );
    } catch (error) {
      throw new Error(error.message || 'Error al obtener citas próximas');
    }
  }

  async getAvailableDoctors(specialty, date) {
    try {
      const response = await this.httpService.get('/doctors/available', {
        params: {
          specialty,
          date: date.toISOString().split('T')[0] // YYYY-MM-DD format
        }
      });
      
      return response.doctors.map(doctor => 
        Doctor.fromPlainObject(doctor)
      );
    } catch (error) {
      throw new Error(error.message || 'Error al obtener doctores disponibles');
    }
  }

  async getAvailableTimeSlots(doctorId, date) {
    try {
      const response = await this.httpService.get(
        `/doctors/${doctorId}/available-slots`,
        {
          params: {
            date: date.toISOString().split('T')[0]
          }
        }
      );
      
      return response.timeSlots || [];
    } catch (error) {
      throw new Error(error.message || 'Error al obtener horarios disponibles');
    }
  }
}