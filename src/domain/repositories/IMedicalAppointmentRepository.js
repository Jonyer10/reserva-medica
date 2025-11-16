/**
 * Puerto (Interface) para el repositorio de citas médicas
 * Define los contratos que debe cumplir cualquier implementación
 */
export class IMedicalAppointmentRepository {
  /**
   * Obtiene todas las citas de un usuario
   * @param {string} userId 
   * @returns {Promise<MedicalAppointment[]>}
   */
  async getUserAppointments(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene una cita por su ID
   * @param {string} appointmentId 
   * @returns {Promise<MedicalAppointment>}
   */
  async getAppointmentById(appointmentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Crea una nueva cita médica
   * @param {Object} appointmentData 
   * @returns {Promise<MedicalAppointment>}
   */
  async createAppointment(appointmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Actualiza una cita existente
   * @param {string} appointmentId 
   * @param {Object} appointmentData 
   * @returns {Promise<MedicalAppointment>}
   */
  async updateAppointment(appointmentId, appointmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Cancela una cita médica
   * @param {string} appointmentId 
   * @returns {Promise<void>}
   */
  async cancelAppointment(appointmentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Reagenda una cita médica
   * @param {string} appointmentId 
   * @param {Date} newDateTime 
   * @returns {Promise<MedicalAppointment>}
   */
  async rescheduleAppointment(appointmentId, newDateTime) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene las citas próximas del usuario
   * @param {string} userId 
   * @param {number} days - número de días hacia adelante
   * @returns {Promise<MedicalAppointment[]>}
   */
  async getUpcomingAppointments(userId, days = 30) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene los doctores disponibles para una especialidad
   * @param {string} specialty 
   * @param {Date} date 
   * @returns {Promise<Doctor[]>}
   */
  async getAvailableDoctors(specialty, date) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene los horarios disponibles de un doctor
   * @param {string} doctorId 
   * @param {Date} date 
   * @returns {Promise<string[]>}
   */
  async getAvailableTimeSlots(doctorId, date) {
    throw new Error('Method not implemented');
  }
}