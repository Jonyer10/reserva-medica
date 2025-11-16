/**
 * Aplicación Principal - Reserva Médica
 * Implementa arquitectura hexagonal con Context API
 */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./presentation/contexts/AuthContext.jsx";
import { AppointmentsProvider } from "./presentation/contexts/AppointmentsContext.jsx";
import { configureApplication } from "./shared/config/applicationConfig";

// Páginas
import { LoginForm } from "./presentation/components/auth/Login";
import { RegisterForm } from "./presentation/components/auth/RegisterForm";
import { Dashboard } from "./presentation/pages/Dashboard";
import { Agendar } from "./presentation/pages/agendar";
import { ProtectedRoute } from "./presentation/components/auth/ProtectedRoute";

// CSS
import "./styles/main.css";

// Configurar arquitectura hexagonal
const { useCases } = configureApplication({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
});

function App() {
  return (
    <Router>
      <AuthProvider authUseCases={useCases.authUseCases}>
        <AppointmentsProvider
          appointmentUseCases={useCases.appointmentUseCases}
        >
          <div className="App">
            <Routes>
              {/* Rutas públicas */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterForm />
                  </ProtectedRoute>
                }
              />

              {/* Rutas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Rutas adicionales (por implementar) */}
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Mis Citas
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Página en desarrollo
                        </p>
                        <a
                          href="/dashboard"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ← Volver al Dashboard
                        </a>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute>
                    <Agendar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Mi Perfil
                        </h2>
                        <p className="text-gray-600 mb-4">
                          Configuración de perfil en desarrollo
                        </p>
                        <a
                          href="/dashboard"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          ← Volver al Dashboard
                        </a>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Ruta por defecto */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Ruta 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        404
                      </h1>
                      <p className="text-gray-600 mb-4">Página no encontrada</p>
                      <a
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ir al Dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </AppointmentsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
