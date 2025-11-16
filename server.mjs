/**
 * Servidor Mock API para desarrollo
 * Simula un backend real con datos de prueba
 */
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'medical_app_secret_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Datos mock
const mockUsers = [
  {
    id: '1',
    email: 'juan.perez@email.com',
    password: 'password123', // En producción esto estaría hasheado
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+52 55 1234 5678',
    dateOfBirth: '1990-05-15',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '2',
    email: 'maria.garcia@email.com',
    password: 'password123',
    firstName: 'María',
    lastName: 'García',
    phone: '+52 55 8765 4321',
    dateOfBirth: '1985-10-20',
    createdAt: new Date('2024-01-02'),
    isActive: true
  }
];

const mockDoctors = [
  {
    id: 'doc1',
    firstName: 'Ana',
    lastName: 'Martínez',
    specialty: 'cardiology',
    licenseNumber: 'MED12345',
    email: 'ana.martinez@hospital.com',
    phone: '+52 55 1111 2222',
    isAvailable: true,
    rating: 4.8,
    reviewCount: 156,
    schedule: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' }
    ]
  },
  {
    id: 'doc2',
    firstName: 'Carlos',
    lastName: 'López',
    specialty: 'general_medicine',
    licenseNumber: 'MED67890',
    email: 'carlos.lopez@hospital.com',
    phone: '+52 55 3333 4444',
    isAvailable: true,
    rating: 4.6,
    reviewCount: 89,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '16:00' }
    ]
  }
];

let mockAppointments = [
  {
    id: 'apt1',
    patientId: '1',
    doctorId: 'doc1',
    doctorName: 'Dra. Ana Martínez',
    specialty: 'cardiology',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
    duration: 30,
    status: 'confirmed',
    notes: 'Consulta de seguimiento',
    location: 'Consulta 101',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: 'apt2',
    patientId: '1',
    doctorId: 'doc2',
    doctorName: 'Dr. Carlos López',
    specialty: 'general_medicine',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 días
    duration: 30,
    status: 'scheduled',
    notes: 'Consulta general',
    location: 'Consulta 205',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10')
  }
];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, firstName, lastName, phone, dateOfBirth, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    password,
    createdAt: new Date(),
    isActive: true
  };

  mockUsers.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = mockUsers.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Sesión cerrada exitosamente' });
});

app.post('/api/auth/verify-token', (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

// Rutas de citas médicas
app.get('/api/appointments/user/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const userAppointments = mockAppointments.filter(apt => apt.patientId === userId);
  
  res.json({ appointments: userAppointments });
});

app.get('/api/appointments/user/:userId/upcoming', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const { days = 30 } = req.query;
  
  const cutoffDate = new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000);
  
  const upcomingAppointments = mockAppointments.filter(apt => 
    apt.patientId === userId && 
    new Date(apt.dateTime) <= cutoffDate &&
    new Date(apt.dateTime) > new Date()
  );
  
  res.json({ appointments: upcomingAppointments });
});

app.get('/api/appointments/:appointmentId', authenticateToken, (req, res) => {
  const { appointmentId } = req.params;
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);
  
  if (!appointment) {
    return res.status(404).json({ message: 'Cita no encontrada' });
  }
  
  res.json({ appointment });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const appointmentData = req.body;
  
  const newAppointment = {
    id: `apt${Date.now()}`,
    ...appointmentData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockAppointments.push(newAppointment);
  
  res.status(201).json({ appointment: newAppointment });
});

app.patch('/api/appointments/:appointmentId/cancel', authenticateToken, (req, res) => {
  const { appointmentId } = req.params;
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Cita no encontrada' });
  }
  
  mockAppointments[appointmentIndex].status = 'cancelled';
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  res.json({ message: 'Cita cancelada exitosamente' });
});

app.patch('/api/appointments/:appointmentId/reschedule', authenticateToken, (req, res) => {
  const { appointmentId } = req.params;
  const { newDateTime } = req.body;
  
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Cita no encontrada' });
  }
  
  mockAppointments[appointmentIndex].dateTime = newDateTime;
  mockAppointments[appointmentIndex].status = 'rescheduled';
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  res.json({ appointment: mockAppointments[appointmentIndex] });
});

app.get('/api/doctors/available', authenticateToken, (req, res) => {
  const { specialty, date } = req.query;
  
  let availableDoctors = mockDoctors.filter(doc => doc.isAvailable);
  
  if (specialty) {
    availableDoctors = availableDoctors.filter(doc => doc.specialty === specialty);
  }
  
  res.json({ doctors: availableDoctors });
});

app.get('/api/doctors/:doctorId/available-slots', authenticateToken, (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  
  // Generar slots de tiempo simulados
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];
  
  // Simular algunos slots ocupados
  const occupiedSlots = ['09:00', '10:30', '15:00'];
  const availableSlots = timeSlots.filter(slot => !occupiedSlots.includes(slot));
  
  res.json({ timeSlots: availableSlots });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🏥 Servidor Mock API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Usuarios de prueba:`);
  console.log(`   - juan.perez@email.com / password123`);
  console.log(`   - maria.garcia@email.com / password123`);
});

export default app;