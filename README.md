# Plataforma de Reservas Médicas

Una aplicación web moderna para gestión de citas médicas desarrollada con React + Vite, implementando **arquitectura hexagonal** y **patrones avanzados** de desarrollo frontend.

## 🏗️ Arquitectura

### Arquitectura Hexagonal (Puertos y Adaptadores)

```
src/
├── domain/                  # Capa de Dominio (Core Business Logic)
│   ├── entities/           # Entidades de negocio
│   ├── repositories/       # Puertos (Interfaces)
│   └── usecases/          # Casos de uso (Lógica de negocio)
│
├── infrastructure/         # Capa de Infraestructura
│   ├── adapters/          # Adaptadores (Implementaciones)
│   └── services/          # Servicios de infraestructura
│
├── presentation/          # Capa de Presentación
│   ├── components/        # Componentes React
│   ├── contexts/         # Context API (Estado global)
│   ├── hooks/           # Hooks personalizados
│   └── pages/          # Páginas principales
│
└── shared/               # Código compartido
    ├── config/          # Configuraciones
    ├── types/          # Tipos y constantes
    └── utils/         # Utilidades
```

## 🚀 Características Principales

### Panel de Usuario

- **Dashboard Principal**: Resumen de citas próximas y estadísticas
- **Gestión de Citas**: Agendar, cancelar y reagendar citas médicas
- **Perfil de Usuario**: Actualización de información personal

### Módulos Principales

1. **Autenticación**

   - Inicio de sesión seguro
   - Registro de nuevos usuarios
   - Validación de sesión persistente
   - Manejo de tokens JWT

2. **Gestión de Citas**

   - Visualización de citas próximas
   - Cancelación con validaciones de tiempo
   - Reagendamiento inteligente
   - Filtros y búsqueda

3. **Dashboard Interactivo**
   - Estadísticas en tiempo real
   - Notificaciones de citas del día
   - Acciones rápidas
   - Información de contacto de emergencia

## 🛠️ Tecnologías y Patrones

### Stack Tecnológico

- **Frontend**: React 19.1.1, Vite, Tailwind CSS
- **Routing**: React Router DOM
- **Estado**: Context API + useReducer
- **HTTP Client**: Axios con interceptors
- **Icons**: Lucide React
- **Fechas**: date-fns

### Patrones Implementados

- **Arquitectura Hexagonal**: Separación clara de responsabilidades
- **Repository Pattern**: Abstracción del acceso a datos
- **Use Case Pattern**: Lógica de negocio encapsulada
- **Context API Pattern**: Gestión de estado global predecible
- **Custom Hooks**: Reutilización de lógica
- **Dependency Injection**: Inversión de dependencias

### Características Avanzadas

- **Validaciones Robustas**: Formularios con validación en tiempo real
- **Manejo de Errores HTTP**: Interceptors y retry automático
- **Persistencia de Estado**: LocalStorage con fallbacks
- **Responsive Design**: Mobile-first con Tailwind
- **Accesibilidad**: WCAG 2.1 compliance
- **TypeSafety**: JSDoc para documentación de tipos

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor mock y aplicación
npm run dev:full

# Solo aplicación frontend
npm run dev

# Solo servidor mock
npm run dev:server
```

### Construcción

```bash
# Construir para producción
npm run build

# Vista previa de la construcción
npm run preview
```

## 🗃️ Base de Datos Mock

El proyecto incluye un servidor mock (`server.mjs`) que simula una API REST completa:

### Usuarios de Prueba

- **juan.perez@email.com** / password123
- **maria.garcia@email.com** / password123

### Endpoints Disponibles

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil actual
- `GET /api/appointments/user/:id` - Citas del usuario
- `POST /api/appointments` - Crear cita
- `PATCH /api/appointments/:id/cancel` - Cancelar cita
- `PATCH /api/appointments/:id/reschedule` - Reagendar cita

## 📋 Funcionalidades del Sistema

### Flujo de Usuario

1. **Registro/Login**: Autenticación segura con validaciones
2. **Dashboard**: Vista general de citas y acciones rápidas
3. **Gestión de Citas**:
   - Ver citas próximas con información detallada
   - Cancelar citas (con restricción de 2 horas)
   - Reagendar citas con selección de horarios
   - Filtrar y buscar citas

### Validaciones de Negocio

- **Horarios**: Solo días laborables (L-V), 8:00 AM - 6:00 PM
- **Cancelaciones**: Mínimo 2 horas de anticipación
- **Reagendamiento**: Solo fechas futuras y horarios disponibles
- **Formularios**: Validación en tiempo real con mensajes descriptivos

## 🎨 UI/UX Design

### Principios de Diseño

- **Mobile-First**: Responsive design optimizado para dispositivos móviles
- **Accesibilidad**: Contraste adecuado, navegación por teclado, screen readers
- **Consistencia**: Sistema de diseño coherente con Tailwind CSS
- **Feedback Visual**: Estados de carga, errores y éxito claramente identificados

## 🚀 Cómo Usar

1. **Ejecutar la aplicación**:

   ```bash
   npm run dev:full
   ```

2. **Abrir en navegador**: http://localhost:5173

3. **Iniciar sesión** con:

   - Email: `juan.perez@email.com`
   - Password: `password123`

4. **Explorar funcionalidades**:
   - Ver dashboard con citas próximas
   - Crear nueva cuenta (registro)
   - Gestionar citas (cancelar/reagendar)
   - Navegar entre secciones

## 📖 Documentación Técnica

### Arquitectura de Dominio

- **Entidades**: `User`, `MedicalAppointment`, `Doctor`
- **Casos de Uso**: `AuthUseCases`, `MedicalAppointmentUseCases`
- **Repositorios**: Interfaces para acceso a datos

### Gestión de Estado

- **Context API**: Estado global reactivo
- **Reducers**: Actualizaciones predictibles
- **Persistencia**: LocalStorage con fallbacks

---

**Desarrollado con ❤️ aplicando arquitectura hexagonal y patrones avanzados de frontend**
