/**
 * Componente de Citas Próximas
 * Muestra una lista de citas próximas con opciones de acción
 */
import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  MoreVertical,
  Edit3,
  X,
  CheckCircle,
} from "lucide-react";
import { useAppointments } from "../../hooks/useAppointments";
import { useAuth } from "../../hooks/useAuth";
import { formatters, dateUtils } from "../../../shared/utils/helpers";
import { MedicalAppointment } from "../../../domain/entities/MedicalAppointment";

export const UpcomingAppointments = ({
  appointments = [],
  showActions = true,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { cancelAppointment, rescheduleAppointment, isLoading } =
    useAppointments();
  const { user } = useAuth();

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await cancelAppointment(appointmentId, user.id);
      setShowActionMenu(null);
    } catch (error) {
      alert(error.message || "Error al cancelar la cita");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRescheduleAppointment = async (appointmentId, newDateTime) => {
    try {
      setIsRescheduling(true);
      await rescheduleAppointment(appointmentId, newDateTime, user.id);
      setSelectedAppointment(null);
      setShowActionMenu(null);
    } catch (error) {
      alert(error.message || "Error al reagendar la cita");
    } finally {
      setIsRescheduling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case MedicalAppointment.STATUS.CONFIRMED:
        return "bg-green-100 text-green-800";
      case MedicalAppointment.STATUS.SCHEDULED:
        return "bg-blue-100 text-blue-800";
      case MedicalAppointment.STATUS.RESCHEDULED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeUntilAppointment = (dateTime) => {
    const now = new Date();
    const appointment = new Date(dateTime);
    const diffInHours = (appointment - now) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((appointment - now) / (1000 * 60));
      return diffInMinutes > 0 ? `En ${diffInMinutes} minutos` : "Ahora";
    } else if (diffInHours < 24) {
      return `En ${Math.floor(diffInHours)} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `En ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-6">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No hay citas próximas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
            appointment.isToday()
              ? "border-blue-300 bg-blue-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.doctorName}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {formatters.formatAppointmentStatus(appointment.status)}
                  </span>
                  {appointment.isToday() && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Hoy
                    </span>
                  )}
                </div>

                {showActions && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionMenu(
                          showActionMenu === appointment.id
                            ? null
                            : appointment.id
                        )
                      }
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {showActionMenu === appointment.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        {appointment.canBeCancelled() && (
                          <button
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            disabled={isCancelling || isLoading}
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <X className="inline h-4 w-4 mr-2" />
                            Cancelar cita
                          </button>
                        )}

                        {appointment.canBeRescheduled() && (
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            disabled={isRescheduling || isLoading}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <Edit3 className="inline h-4 w-4 mr-2" />
                            Reagendar
                          </button>
                        )}

                        <button
                          onClick={() => setShowActionMenu(null)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Ver detalles
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-3">
                {formatters.formatSpecialty(appointment.specialty)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {formatters.formatDate(appointment.dateTime)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {formatters.formatTime(appointment.dateTime)}
                  </span>
                  <span className="text-xs text-blue-600">
                    ({getTimeUntilAppointment(appointment.dateTime)})
                  </span>
                </div>

                {appointment.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {appointment.location}
                    </span>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Notas:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Modal de reagendamiento */}
      {selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onReschedule={handleRescheduleAppointment}
          onClose={() => setSelectedAppointment(null)}
          isLoading={isRescheduling}
        />
      )}
    </div>
  );
};

// Componente modal para reagendar citas
const RescheduleModal = ({ appointment, onReschedule, onClose, isLoading }) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    const newDateTime = new Date(`${newDate}T${newTime}`);
    onReschedule(appointment.id, newDateTime);
  };

  // Generar slots de tiempo disponibles para el día seleccionado
  const generateTimeSlots = () => {
    if (!newDate) return [];

    const selectedDate = new Date(newDate);
    return dateUtils.generateTimeSlots(selectedDate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Reagendar Cita</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Cita actual:</strong>{" "}
            {formatters.formatDateTime(appointment.dateTime)}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Doctor:</strong> {appointment.doctorName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva fecha
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setNewTime("");
                setAvailableSlots(generateTimeSlots());
              }}
              min={dateUtils.getCurrentDate()}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva hora
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!newDate}
            >
              <option value="">Seleccionar hora</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !newDate || !newTime}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Reagendando...
                </>
              ) : (
                <>
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
