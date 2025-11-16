/**
 * Componente para agendar nuevas citas médicas
 * Formulario básico con validaciones y estilos médicos
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { FORM_STATES } from "../../shared/types/constants";

export const Agendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAppointment } = useAppointments();

  const [formData, setFormData] = useState({
    specialty: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  const [formState, setFormState] = useState(FORM_STATES.IDLE);
  const [validationErrors, setValidationErrors] = useState({});

  // Especialidades médicas disponibles
  const specialties = [
    { id: "cardiology", name: "Cardiología" },
    { id: "dermatology", name: "Dermatología" },
    { id: "orthopedics", name: "Traumatología" },
    { id: "pediatrics", name: "Pediatría" },
    { id: "gynecology", name: "Ginecología" },
    { id: "neurology", name: "Neurología" },
  ];

  // Doctores disponibles por especialidad
  const doctors = {
    cardiology: [{ id: "dr1", name: "Dr. María González" }],
    dermatology: [{ id: "dr2", name: "Dr. Carlos Ruiz" }],
    orthopedics: [{ id: "dr3", name: "Dra. Ana López" }],
    pediatrics: [{ id: "dr4", name: "Dr. Luis Martínez" }],
    gynecology: [{ id: "dr5", name: "Dra. Carmen Silva" }],
    neurology: [{ id: "dr6", name: "Dr. Roberto Díaz" }],
  };

  // Horarios disponibles
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset doctor when specialty changes
      ...(name === "specialty" && { doctorId: "" }),
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.specialty) {
      errors.specialty = "Selecciona una especialidad";
    }

    if (!formData.doctorId) {
      errors.doctorId = "Selecciona un doctor";
    }

    if (!formData.date) {
      errors.date = "Selecciona una fecha";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = "No puedes agendar citas en fechas pasadas";
      }

      if (selectedDate.getDay() === 0) {
        errors.date = "No se atiende los domingos";
      }
    }

    if (!formData.time) {
      errors.time = "Selecciona un horario";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(FORM_STATES.LOADING);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormState(FORM_STATES.IDLE);
      return;
    }

    try {
      const selectedDoctor = doctors[formData.specialty]?.find(
        (d) => d.id === formData.doctorId
      );
      const appointmentData = {
        userId: user.id,
        doctorId: formData.doctorId,
        doctorName: selectedDoctor?.name || "Doctor",
        specialty: formData.specialty,
        dateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        notes: formData.notes,
        status: "pending",
      };

      await createAppointment(appointmentData);
      setFormState(FORM_STATES.SUCCESS);

      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (_err) {
      setFormState(FORM_STATES.ERROR);
    }
  };

  // Mostrar mensaje de éxito
  if (formState === FORM_STATES.SUCCESS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Cita Agendada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu cita ha sido agendada exitosamente. Te redirigiremos al
            dashboard.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link
              to="/dashboard"
              className="flex items-center text-medical-600 hover:text-medical-700 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Volver
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Agendar Nueva Cita
            </h1>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Especialidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Stethoscope className="inline h-4 w-4 mr-1" />
                  Especialidad Médica
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 ${
                    validationErrors.specialty
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona una especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
                {validationErrors.specialty && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.specialty}
                  </p>
                )}
              </div>

              {/* Doctor */}
              {formData.specialty && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 ${
                      validationErrors.doctorId
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona un doctor</option>
                    {doctors[formData.specialty]?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.doctorId && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.doctorId}
                    </p>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 ${
                      validationErrors.date
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {validationErrors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.date}
                    </p>
                  )}
                </div>

                {/* Horario */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Horario
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 ${
                      validationErrors.time
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona un horario</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {validationErrors.time && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                />
              </div>

              {/* Botón de envío */}
              <div className="flex items-center space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={formState === FORM_STATES.LOADING}
                  className="flex-1 bg-medical-600 text-white py-3 px-6 rounded-xl hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {formState === FORM_STATES.LOADING
                    ? "Agendando..."
                    : "Agendar Cita"}
                </button>

                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </Link>
              </div>

              {formState === FORM_STATES.ERROR && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <p>
                    Error al agendar la cita. Por favor, inténtalo nuevamente.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
