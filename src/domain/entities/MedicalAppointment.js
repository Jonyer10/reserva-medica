/**
 * Entidad Cita Médica - Define la estructura y comportamientos de una cita
 */
export class MedicalAppointment {
  static STATUS = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled'
  };

  static SPECIALTIES = {
    GENERAL_MEDICINE: 'general_medicine',
    CARDIOLOGY: 'cardiology',
    DERMATOLOGY: 'dermatology',
    ORTHOPEDICS: 'orthopedics',
    PEDIATRICS: 'pediatrics',
    GYNECOLOGY: 'gynecology',
    PSYCHIATRY: 'psychiatry',
    OPHTHALMOLOGY: 'ophthalmology'
  };

  constructor({
    id,
    patientId,
    doctorId,
    doctorName,
    specialty,
    dateTime,
    duration = 30,
    status = MedicalAppointment.STATUS.SCHEDULED,
    notes = '',
    location = '',
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.doctorName = doctorName;
    this.specialty = specialty;
    this.dateTime = new Date(dateTime);
    this.duration = duration;
    this.status = status;
    this.notes = notes;
    this.location = location;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Valida si la cita puede ser cancelada
   */
  canBeCancelled() {
    const validStatuses = [
      MedicalAppointment.STATUS.SCHEDULED,
      MedicalAppointment.STATUS.CONFIRMED
    ];
    
    // No se puede cancelar si ya pasó o está muy próxima (menos de 2 horas)
    const now = new Date();
    const timeDiff = this.dateTime.getTime() - now.getTime();
    const hoursUntilAppointment = timeDiff / (1000 * 3600);

    return validStatuses.includes(this.status) && hoursUntilAppointment >= 2;
  }

  /**
   * Valida si la cita puede ser reagendada
   */
  canBeRescheduled() {
    return this.canBeCancelled(); // Mismas condiciones que cancelar
  }

  /**
   * Calcula la fecha y hora de finalización
   */
  get endDateTime() {
    const endTime = new Date(this.dateTime);
    endTime.setMinutes(endTime.getMinutes() + this.duration);
    return endTime;
  }

  /**
   * Verifica si la cita es próxima (dentro de las próximas 24 horas)
   */
  isUpcoming() {
    const now = new Date();
    const timeDiff = this.dateTime.getTime() - now.getTime();
    const hoursUntilAppointment = timeDiff / (1000 * 3600);
    
    return hoursUntilAppointment > 0 && hoursUntilAppointment <= 24;
  }

  /**
   * Verifica si la cita es del día actual
   */
  isToday() {
    const now = new Date();
    return this.dateTime.toDateString() === now.toDateString();
  }

  /**
   * Cancela la cita
   */
  cancel() {
    if (!this.canBeCancelled()) {
      throw new Error('Esta cita no puede ser cancelada');
    }
    this.status = MedicalAppointment.STATUS.CANCELLED;
    this.updatedAt = new Date();
  }

  /**
   * Reagenda la cita
   */
  reschedule(newDateTime) {
    if (!this.canBeRescheduled()) {
      throw new Error('Esta cita no puede ser reagendada');
    }
    this.dateTime = new Date(newDateTime);
    this.status = MedicalAppointment.STATUS.RESCHEDULED;
    this.updatedAt = new Date();
  }

  /**
   * Convierte la entidad a un objeto plano
   */
  toPlainObject() {
    return {
      id: this.id,
      patientId: this.patientId,
      doctorId: this.doctorId,
      doctorName: this.doctorName,
      specialty: this.specialty,
      dateTime: this.dateTime.toISOString(),
      duration: this.duration,
      status: this.status,
      notes: this.notes,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromPlainObject(obj) {
    return new MedicalAppointment(obj);
  }

  /**
   * Obtiene el nombre legible de la especialidad
   */
  static getSpecialtyName(specialty) {
    const specialtyNames = {
      [MedicalAppointment.SPECIALTIES.GENERAL_MEDICINE]: 'Medicina General',
      [MedicalAppointment.SPECIALTIES.CARDIOLOGY]: 'Cardiología',
      [MedicalAppointment.SPECIALTIES.DERMATOLOGY]: 'Dermatología',
      [MedicalAppointment.SPECIALTIES.ORTHOPEDICS]: 'Traumatología',
      [MedicalAppointment.SPECIALTIES.PEDIATRICS]: 'Pediatría',
      [MedicalAppointment.SPECIALTIES.GYNECOLOGY]: 'Ginecología',
      [MedicalAppointment.SPECIALTIES.PSYCHIATRY]: 'Psiquiatría',
      [MedicalAppointment.SPECIALTIES.OPHTHALMOLOGY]: 'Oftalmología'
    };
    return specialtyNames[specialty] || specialty;
  }
}