/**
 * Puerto (Interface) para el repositorio de citas médicas
 * Define los contratos que debe cumplir cualquier implementación
 */
export class IMedicalAppointmentRepository {
  /**
   * Obtiene todas las citas de un usuario
   * @param {string} _userId 
   * @returns {Promise<MedicalAppointment[]>}
   */
  async getUserAppointments(_userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene una cita por su ID
   * @param {string} _appointmentId 
   * @returns {Promise<MedicalAppointment>}
   */
  async getAppointmentById(_appointmentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Crea una nueva cita médica
   * @param {Object} _appointmentData 
   * @returns {Promise<MedicalAppointment>}
   */
  async createAppointment(_appointmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Actualiza una cita existente
   * @param {string} _appointmentId 
   * @param {Object} _appointmentData 
   * @returns {Promise<MedicalAppointment>}
   */
  async updateAppointment(_appointmentId, _appointmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Cancela una cita médica
   * @param {string} _appointmentId 
   * @returns {Promise<void>}
   */
  async cancelAppointment(_appointmentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Reagenda una cita médica
   * @param {string} _appointmentId 
   * @param {Date} _newDateTime 
   * @returns {Promise<MedicalAppointment>}
   */
  async rescheduleAppointment(_appointmentId, _newDateTime) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene las citas próximas del usuario
   * @param {string} _userId 
   * @param {number} _days - número de días hacia adelante
   * @returns {Promise<MedicalAppointment[]>}
   */
  async getUpcomingAppointments(_userId, _days = 30) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene los doctores disponibles para una especialidad
   * @param {string} _specialty 
   * @param {Date} _date 
   * @returns {Promise<Doctor[]>}
   */
  async getAvailableDoctors(_specialty, _date) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtiene los horarios disponibles de un doctor
   * @param {string} _doctorId 
   * @param {Date} _date 
   * @returns {Promise<string[]>}
   */
  async getAvailableTimeSlots(_doctorId, _date) {
    throw new Error('Method not implemented');
  }
}