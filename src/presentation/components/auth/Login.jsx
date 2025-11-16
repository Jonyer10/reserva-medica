/**
 * Componente de Login Organizado
 * Implementa formulario de inicio de sesión con clases CSS organizadas
 */
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { validators } from "../../../shared/utils/helpers";
import { FORM_STATES } from "../../../shared/types/constants";
import { UserMedicalIcon } from "../common/icons/UserMedicalIcon";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState(FORM_STATES.IDLE);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, isAuthenticated, error, clearError } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(FORM_STATES.LOADING);

    // Validaciones
    const errors = {};
    if (!validators.isValidEmail(formData.email)) {
      errors.email = "Por favor ingresa un email válido";
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormState(FORM_STATES.IDLE);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setFormState(FORM_STATES.SUCCESS);
    } catch {
      setFormState(FORM_STATES.IDLE);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Encabezado del login */}
        <div className="login-header">
          <div className="login-icon">
            <UserMedicalIcon size={32} className="text-white" />
          </div>
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">
            Inicia sesión para acceder a tu panel médico
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Mensajes de error */}
          {(error || Object.keys(validationErrors).length > 0) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {error || "Por favor corrige los errores en el formulario"}
              </span>
            </div>
          )}

          {/* Panel de credenciales demo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <div className="font-semibold text-blue-700 mb-2">
              🔑 Credenciales de Demo:
            </div>
            <div className="space-y-1 text-blue-600">
              <div>👨‍⚕️ Admin: admin@medical.com / admin123</div>
              <div>👤 Paciente: patient@medical.com / patient123</div>
              <div>🧪 Demo: demo@demo.com / demo</div>
            </div>
          </div>

          {/* Campo de email */}
          <div
            className={`login-field-wrapper ${
              validationErrors.email ? "login-field-error" : ""
            }`}
          >
            <label htmlFor="email" className="login-field-label">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="login-field-input"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && (
              <p className="login-error-message">{validationErrors.email}</p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div
            className={`login-field-wrapper ${
              validationErrors.password ? "login-field-error" : ""
            }`}
          >
            <label htmlFor="password" className="login-field-label">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="login-field-input pr-12"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="login-error-message">{validationErrors.password}</p>
            )}
          </div>

          {/* Opciones adicionales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-700"
              >
                Recordar sesión
              </label>
            </div>
            <Link to="/forgot-password" className="login-link text-sm">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={formState === FORM_STATES.LOADING}
            className="login-submit-button"
          >
            {formState === FORM_STATES.LOADING ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p className="text-sm text-gray-600 mb-3">¿No tienes cuenta?</p>
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
          >
            Crear cuenta nueva
          </Link>
        </div>
      </div>
    </div>
  );
};
