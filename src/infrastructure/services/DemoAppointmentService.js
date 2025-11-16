/**
 * Servicio de Citas de Demo
 * Simula citas médicas para desarrollo sin backend
 */

// Datos de demostración para citas
const DEMO_APPOINTMENTS = [
  {
    id: '1',
    userId: '2',
    doctorId: 'dr1',
    doctorName: 'Dr. María González',
    specialty: 'cardiology',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // En 2 horas
    status: 'confirmed',
    location: 'Consultorio 101',
    notes: 'Consulta de seguimiento cardiológico',
    phone: '+52 55 1234-5678',
    duration: 30
  },
  {
    id: '2',
    userId: '2',
    doctorId: 'dr2',
    doctorName: 'Dr. Carlos Ramírez',
    specialty: 'general_medicine',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
    status: 'scheduled',
    location: 'Consultorio 205',
    notes: 'Revisión médica general',
    phone: '+52 55 2345-6789',
    duration: 45
  },
  {
    id: '3',
    userId: '2',
    doctorId: 'dr3',
    doctorName: 'Dra. Ana Martínez',
    specialty: 'dermatology',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 días
    status: 'scheduled',
    location: 'Consultorio 310',
    notes: 'Revisión de lunares y piel',
    phone: '+52 55 3456-7890',
    duration: 30
  },
  {
    id: '4',
    userId: '2',
    doctorId: 'dr4',
    doctorName: 'Dr. Luis Hernández',
    specialty: 'orthopedics',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En una semana
    status: 'confirmed',
    location: 'Consultorio 102',
    notes: 'Seguimiento de lesión en rodilla',
    phone: '+52 55 4567-8901',
    duration: 60
  },
  {
    id: '5',
    userId: '3',
    doctorId: 'dr1',
    doctorName: 'Dr. María González',
    specialty: 'cardiology',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // En 4 horas
    status: 'confirmed',
    location: 'Consultorio 101',
    notes: 'Primera consulta cardiológica',
    phone: '+52 55 1234-5678',
    duration: 45
  }
];

// Doctores disponibles
const DEMO_DOCTORS = [
  {
    id: 'dr1',
    name: 'Dr. María González',
    specialty: 'cardiology',
    avatar: null,
    phone: '+52 55 1234-5678',
    location: 'Consultorio 101'
  },
  {
    id: 'dr2',
    name: 'Dr. Carlos Ramírez',
    specialty: 'general_medicine',
    avatar: null,
    phone: '+52 55 2345-6789',
    location: 'Consultorio 205'
  },
  {
    id: 'dr3',
    name: 'Dra. Ana Martínez',
    specialty: 'dermatology',
    avatar: null,
    phone: '+52 55 3456-7890',
    location: 'Consultorio 310'
  },
  {
    id: 'dr4',
    name: 'Dr. Luis Hernández',
    specialty: 'orthopedics',
    avatar: null,
    phone: '+52 55 4567-8901',
    location: 'Consultorio 102'
  },
  {
    id: 'dr5',
    name: 'Dra. Carmen López',
    specialty: 'gynecology',
    avatar: null,
    phone: '+52 55 5678-9012',
    location: 'Consultorio 401'
  }
];

class DemoAppointmentService {
  constructor() {
    this.appointments = [...DEMO_APPOINTMENTS];
    this.doctors = [...DEMO_DOCTORS];
  }

  async getUserAppointments(userId, limit = 10) {
    await this.simulateNetworkDelay();

    const userAppointments = this.appointments
      .filter(apt => apt.userId === userId)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, limit);

    return this.enhanceAppointments(userAppointments);
  }

  async getUpcomingAppointments(userId, days = 30) {
    await this.simulateNetworkDelay();

    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const upcomingAppointments = this.appointments
      .filter(apt => {
        const aptDate = new Date(apt.dateTime);
        return apt.userId === userId && 
               aptDate >= now && 
               aptDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    return this.enhanceAppointments(upcomingAppointments);
  }

  async createAppointment(appointmentData, userId) {
    await this.simulateNetworkDelay(1000);

    const newAppointment = {
      id: String(Date.now()),
      userId: userId,
      ...appointmentData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);

    return {
      success: true,
      appointment: this.enhanceAppointment(newAppointment)
    };
  }

  async cancelAppointment(appointmentId, userId) {
    await this.simulateNetworkDelay();

    const appointmentIndex = this.appointments.findIndex(
      apt => apt.id === appointmentId && apt.userId === userId
    );

    if (appointmentIndex === -1) {
      throw new Error('Cita no encontrada');
    }

    const appointment = this.appointments[appointmentIndex];
    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 2) {
      throw new Error('No se puede cancelar una cita con menos de 2 horas de anticipación');
    }

    this.appointments[appointmentIndex].status = 'cancelled';
    this.appointments[appointmentIndex].cancelledAt = new Date().toISOString();

    return {
      success: true,
      message: 'Cita cancelada exitosamente'
    };
  }

  async rescheduleAppointment(appointmentId, newDateTime, userId) {
    await this.simulateNetworkDelay(800);

    const appointmentIndex = this.appointments.findIndex(
      apt => apt.id === appointmentId && apt.userId === userId
    );

    if (appointmentIndex === -1) {
      throw new Error('Cita no encontrada');
    }

    // Verificar disponibilidad del nuevo horario
    const isSlotAvailable = await this.checkTimeSlotAvailability(
      this.appointments[appointmentIndex].doctorId,
      newDateTime
    );

    if (!isSlotAvailable) {
      throw new Error('El horario seleccionado no está disponible');
    }

    this.appointments[appointmentIndex] = {
      ...this.appointments[appointmentIndex],
      dateTime: newDateTime,
      status: 'rescheduled',
      rescheduledAt: new Date().toISOString()
    };

    return {
      success: true,
      appointment: this.enhanceAppointment(this.appointments[appointmentIndex])
    };
  }

  async getAvailableDoctors(specialty, date) {
    await this.simulateNetworkDelay();

    let availableDoctors = this.doctors;

    if (specialty && specialty !== 'all') {
      availableDoctors = availableDoctors.filter(dr => dr.specialty === specialty);
    }

    // Simular disponibilidad basada en citas existentes
    if (date) {
      const appointmentsOnDate = this.appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime).toDateString();
        const requestedDate = new Date(date).toDateString();
        return aptDate === requestedDate;
      });

      availableDoctors = availableDoctors.map(doctor => ({
        ...doctor,
        appointmentsCount: appointmentsOnDate.filter(apt => apt.doctorId === doctor.id).length,
        isAvailable: appointmentsOnDate.filter(apt => apt.doctorId === doctor.id).length < 8
      }));
    }

    return availableDoctors;
  }

  async getAvailableTimeSlots(doctorId, date) {
    await this.simulateNetworkDelay();

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // No disponible en fin de semana
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }

    // Horarios base (9:00 AM - 6:00 PM, con pausa de almuerzo 2:00 PM - 3:00 PM)
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    // Obtener citas existentes para ese doctor en esa fecha
    const existingAppointments = this.appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      return apt.doctorId === doctorId && 
             aptDate.toDateString() === requestedDate.toDateString() &&
             apt.status !== 'cancelled';
    });

    // Filtrar horarios ocupados
    const availableSlots = baseSlots.filter(slot => {
      const [hours, minutes] = slot.split(':');
      const slotDateTime = new Date(requestedDate);
      slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const isSlotTaken = existingAppointments.some(apt => {
        const aptTime = new Date(apt.dateTime);
        return Math.abs(aptTime - slotDateTime) < 30 * 60 * 1000; // 30 minutos de diferencia
      });

      return !isSlotTaken;
    });

    return availableSlots.map(slot => ({
      time: slot,
      available: true
    }));
  }

  async checkTimeSlotAvailability(doctorId, dateTime) {
    await this.simulateNetworkDelay(300);

    const requestedDateTime = new Date(dateTime);
    const existingAppointments = this.appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      return apt.doctorId === doctorId && 
             apt.status !== 'cancelled' &&
             Math.abs(aptDate - requestedDateTime) < 30 * 60 * 1000; // 30 minutos
    });

    return existingAppointments.length === 0;
  }

  // Métodos auxiliares
  enhanceAppointments(appointments) {
    return appointments.map(apt => this.enhanceAppointment(apt));
  }

  enhanceAppointment(appointment) {
    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();

    return {
      ...appointment,
      isToday: () => {
        return appointmentDate.toDateString() === now.toDateString();
      },
      canBeCancelled: () => {
        const hoursUntil = (appointmentDate - now) / (1000 * 60 * 60);
        return hoursUntil >= 2 && appointment.status !== 'cancelled';
      },
      canBeRescheduled: () => {
        const hoursUntil = (appointmentDate - now) / (1000 * 60 * 60);
        return hoursUntil >= 24 && ['scheduled', 'confirmed'].includes(appointment.status);
      },
      timeUntilAppointment: () => {
        const diffInHours = (appointmentDate - now) / (1000 * 60 * 60);
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor((appointmentDate - now) / (1000 * 60));
          return diffInMinutes > 0 ? `En ${diffInMinutes} minutos` : 'Ahora';
        } else if (diffInHours < 24) {
          return `En ${Math.floor(diffInHours)} horas`;
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          return `En ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
        }
      }
    };
  }

  async simulateNetworkDelay(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const demoAppointmentService = new DemoAppointmentService();

export default DemoAppointmentService;