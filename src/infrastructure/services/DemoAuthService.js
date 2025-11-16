/**
 * Servicio de Autenticación de Demo
 * Simula un servicio de autenticación para desarrollo sin backend
 */

// Usuarios de demo
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@medical.com',
    password: 'admin123',
    name: 'Dr. Admin',
    firstName: 'Admin',
    lastName: 'Médico',
    fullName: 'Dr. Admin Médico',
    role: 'doctor',
    avatar: null
  },
  {
    id: '2',
    email: 'patient@medical.com',
    password: 'patient123',
    name: 'Juan Pérez',
    firstName: 'Juan',
    lastName: 'Pérez',
    fullName: 'Juan Pérez',
    role: 'patient',
    avatar: null
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'demo',
    name: 'Usuario Demo',
    firstName: 'Usuario',
    lastName: 'Demo',
    fullName: 'Usuario Demo',
    role: 'patient',
    avatar: null
  }
];

class DemoAuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.isInitialized = false;
    
    // Simular inicialización
    this.init();
  }

  async init() {
    // Simular verificación de token existente
    const savedToken = localStorage.getItem('medical_token');
    const savedUser = localStorage.getItem('medical_user');

    if (savedToken && savedUser) {
      try {
        this.token = savedToken;
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        this.logout();
      }
    }

    this.isInitialized = true;
  }

  async login(email, password) {
    // Simular delay de red
    await this.simulateNetworkDelay();

    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token fake
    const token = this.generateFakeToken();

    // Guardar en memoria
    this.currentUser = { ...user };
    this.token = token;

    // Guardar en localStorage
    localStorage.setItem('medical_token', token);
    localStorage.setItem('medical_user', JSON.stringify(this.currentUser));

    // Eliminar password del objeto de retorno
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: token
    };
  }

  async logout() {
    // Simular delay de red
    await this.simulateNetworkDelay(500);

    // Limpiar memoria
    this.currentUser = null;
    this.token = null;

    // Limpiar localStorage
    localStorage.removeItem('medical_token');
    localStorage.removeItem('medical_user');

    return true;
  }

  async register(userData) {
    // Simular delay de red
    await this.simulateNetworkDelay(1000);

    // Verificar si el email ya existe
    const existingUser = DEMO_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
      id: String(Date.now()),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: `${userData.firstName} ${userData.lastName}`,
      role: 'patient',
      avatar: null
    };

    // En un servicio real, aquí se guardaría en la base de datos
    // Para demo, solo agregamos al array local
    DEMO_USERS.push({ ...newUser, password: userData.password });

    return newUser;
  }

  async updateProfile(userData) {
    // Simular delay de red
    await this.simulateNetworkDelay();

    if (!this.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Actualizar datos del usuario
    this.currentUser = {
      ...this.currentUser,
      ...userData,
      fullName: `${userData.firstName || this.currentUser.firstName} ${userData.lastName || this.currentUser.lastName}`
    };

    // Actualizar localStorage
    localStorage.setItem('medical_user', JSON.stringify(this.currentUser));

    return this.currentUser;
  }

  async isAuthenticated() {
    if (!this.isInitialized) {
      await this.init();
    }
    return !!this.token && !!this.currentUser;
  }

  async getCurrentUser() {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.currentUser;
  }

  async refreshToken() {
    // Simular delay de red
    await this.simulateNetworkDelay();

    if (!this.token) {
      throw new Error('No hay token para renovar');
    }

    // Generar nuevo token
    const newToken = this.generateFakeToken();
    this.token = newToken;

    // Actualizar localStorage
    localStorage.setItem('medical_token', newToken);

    return newToken;
  }

  // Métodos utilitarios
  generateFakeToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `demo_token_${timestamp}_${random}`;
  }

  async simulateNetworkDelay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para obtener credenciales de demo
  getDemoCredentials() {
    return [
      {
        email: 'admin@medical.com',
        password: 'admin123',
        role: 'Médico/Admin'
      },
      {
        email: 'patient@medical.com', 
        password: 'patient123',
        role: 'Paciente'
      },
      {
        email: 'demo@demo.com',
        password: 'demo',
        role: 'Demo'
      }
    ];
  }
}

// Singleton instance
export const demoAuthService = new DemoAuthService();

export default DemoAuthService;