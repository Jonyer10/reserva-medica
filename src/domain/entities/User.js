/**
 * Entidad Usuario - Define la estructura y comportamientos de un usuario
 * Aplicando principios DDD (Domain Driven Design)
 */
export class User {
  constructor({
    id,
    email,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    createdAt = new Date(),
    isActive = true
  }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.createdAt = createdAt;
    this.isActive = isActive;
  }

  /**
   * Getter para obtener el nombre completo del usuario
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Valida si el usuario es mayor de edad
   */
  isAdult() {
    if (!this.dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  }

  /**
   * Valida la estructura del email
   */
  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Convierte la entidad a un objeto plano para serialización
   */
  toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      createdAt: this.createdAt,
      isActive: this.isActive
    };
  }

  /**
   * Crea una instancia desde un objeto plano
   */
  static fromPlainObject(obj) {
    return new User(obj);
  }
}