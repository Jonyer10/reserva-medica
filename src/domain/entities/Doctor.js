/**
 * Entidad Doctor - Define la estructura de un médico
 */
export class Doctor {
  constructor({
    id,
    firstName,
    lastName,
    specialty,
    licenseNumber,
    email,
    phone,
    isAvailable = true,
    schedule = [],
    rating = 0,
    reviewCount = 0
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.specialty = specialty;
    this.licenseNumber = licenseNumber;
    this.email = email;
    this.phone = phone;
    this.isAvailable = isAvailable;
    this.schedule = schedule;
    this.rating = rating;
    this.reviewCount = reviewCount;
  }

  /**
   * Getter para obtener el nombre completo del doctor
   */
  get fullName() {
    return `Dr. ${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Verifica si el doctor está disponible en una fecha específica
   */
  isAvailableAt(dateTime) {
    if (!this.isAvailable) return false;
    
    const dayOfWeek = dateTime.getDay(); // 0 = Domingo, 6 = Sábado
    const time = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
    
    return this.schedule.some(slot => 
      slot.dayOfWeek === dayOfWeek && 
      time >= slot.startTime && 
      time <= slot.endTime
    );
  }

  /**
   * Convierte la entidad a un objeto plano
   */
  toPlainObject() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      specialty: this.specialty,
      licenseNumber: this.licenseNumber,
      email: this.email,
      phone: this.phone,
      isAvailable: this.isAvailable,
      schedule: this.schedule,
      rating: this.rating,
      reviewCount: this.reviewCount
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromPlainObject(obj) {
    return new Doctor(obj);
  }
}