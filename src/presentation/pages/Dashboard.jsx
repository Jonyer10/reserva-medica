/**
 * Página de Dashboard Principal - Versión Modernizada
 * Panel principal del usuario con resumen de citas y navegación profesional
 */
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Settings,
  LogOut,
  Bell,
  Plus,
  Filter,
  Search,
  ChevronDown,
  Activity,
  TrendingUp,
  Users,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppointments } from "../hooks/useAppointments";
import { UpcomingAppointments } from "../components/appointments/UpcomingAppointments";
import { QuickActions } from "../components/common/QuickActions";
import { formatters } from "../../shared/utils/helpers";
import {
  HeaderUserAvatar,
  ProfileAvatar,
} from "../components/common/MedicalAvatar";
import { UserMedicalIcon } from "../components/common/icons/UserMedicalIcon";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { upcomingAppointments, loadUpcomingAppointments, isLoading, error } =
    useAppointments();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (user?.id) {
      loadUpcomingAppointments(user.id, 7); // Próximos 7 días
    }
  }, [user, loadUpcomingAppointments]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const filteredAppointments = upcomingAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatters
        .formatSpecialty(appointment.specialty)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || appointment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const todaysAppointments = upcomingAppointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.dateTime);
    return appointmentDate.toDateString() === today.toDateString();
  });

  const stats = {
    total: upcomingAppointments.length,
    today: todaysAppointments.length,
    thisWeek: upcomingAppointments.length,
    confirmed: upcomingAppointments.filter((apt) => apt.status === "confirmed")
      .length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-medical-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-medical-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-medical-400/5 to-blue-400/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-medical-300/5 to-purple-400/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      {/* Header modernizado */}
      <header className="bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/30 relative z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-medical-50/20 before:to-blue-50/20 before:pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-6">
              <div className="h-16 w-16 bg-gradient-to-br from-medical-500 via-medical-400 to-medical-300 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-medical-600/20 to-transparent"></div>
                <UserMedicalIcon
                  size={32}
                  variant="gradient"
                  className="text-white drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-3xl shadow-inner"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-medical-800 to-medical-600 bg-clip-text text-transparent tracking-tight">
                  Panel Médico
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 font-medium">
                    {formatters.formatDate(new Date())}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notificaciones modernas */}
              <div className="relative">
                <button className="p-3 rounded-xl bg-white/60 hover:bg-medical-100/80 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm">
                  <Bell className="h-5 w-5 text-slate-600" />
                  {stats.today > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                      {stats.today}
                    </span>
                  )}
                </button>
              </div>

              {/* Perfil de usuario modernizado */}
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/40 hover:bg-white/80 transition-all duration-300 group">
                <HeaderUserAvatar user={user} />
                <div className="hidden sm:block text-right">
                  <div className="font-semibold text-slate-800 text-sm">
                    {user?.fullName || "Usuario"}
                  </div>
                  <div className="text-xs text-slate-600">{user?.email}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="p-3 rounded-xl bg-white/60 hover:bg-blue-100/80 transition-all duration-300 shadow-md hover:shadow-lg text-slate-600 hover:text-blue-700"
                  title="Configuración"
                >
                  <Settings className="h-5 w-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-white/60 hover:bg-red-100/80 transition-all duration-300 shadow-md hover:shadow-lg text-slate-600 hover:text-red-700"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saludo modernizado */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-medical-500 via-medical-400 to-blue-400 rounded-t-3xl"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-medical-300/20 to-blue-300/20 rounded-full blur-xl"></div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-medical-800 to-medical-600 bg-clip-text text-transparent mb-4 relative z-10">
              ¡Hola, {user?.firstName}!{" "}
              <span className="animate-wave inline-block">👋</span>
            </h2>
            <p className="text-slate-700 font-medium text-xl relative z-10 leading-relaxed">
              Bienvenido de vuelta. Aquí tienes un resumen completo de tu
              actividad médica y próximas citas
            </p>
          </div>
        </div>

        {/* Tarjetas de estadísticas modernizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                  Citas Hoy
                </p>
                <p className="text-4xl font-bold text-blue-600 mb-1">
                  {stats.today}
                </p>
                <p className="text-xs text-blue-500 font-medium">
                  Agenda del día
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl group-hover:shadow-blue-300/50 transition-shadow duration-300">
                <CalendarDays className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                  Esta Semana
                </p>
                <p className="text-4xl font-bold text-green-600 mb-1">
                  {stats.thisWeek}
                </p>
                <p className="text-xs text-green-500 font-medium">
                  Próximos 7 días
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl group-hover:shadow-green-300/50 transition-shadow duration-300">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-500 to-medical-600 rounded-t-2xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-medical-400/10 to-medical-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                  Total Próximas
                </p>
                <p className="text-4xl font-bold text-medical-600 mb-1">
                  {stats.total}
                </p>
                <p className="text-xs text-medical-500 font-medium">
                  Citas pendientes
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-600 text-white shadow-xl group-hover:shadow-medical-300/50 transition-shadow duration-300">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl hover:scale-105 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                  Confirmadas
                </p>
                <p className="text-4xl font-bold text-purple-600 mb-1">
                  {stats.confirmed}
                </p>
                <p className="text-xs text-purple-500 font-medium">
                  Listas para atención
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl group-hover:shadow-purple-300/50 transition-shadow duration-300">
                <Activity className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas modernizadas */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Citas próximas modernizadas */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
              <div className="px-8 py-6 border-b border-white/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-medical-700 bg-clip-text text-transparent">
                    Próximas Citas
                  </h3>
                  <Link
                    to="/appointments"
                    className="px-6 py-2 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Ver todas
                  </Link>
                </div>

                {/* Filtros y búsqueda modernizados */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-medical-500 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Buscar por doctor o especialidad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-medical-400/50 focus:border-medical-400 focus:bg-white transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-50/50 rounded-xl px-4 py-3 border-2 border-slate-200 shadow-sm">
                    <Filter className="h-5 w-5 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent border-none focus:outline-none text-slate-900 font-medium"
                    >
                      <option value="all">Todas</option>
                      <option value="scheduled">Programadas</option>
                      <option value="confirmed">Confirmadas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-medical-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-medical-500 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="bg-red-50/80 rounded-2xl p-6 max-w-md mx-auto">
                      <p className="text-red-600 font-semibold mb-4">
                        Error al cargar las citas
                      </p>
                      <button
                        onClick={() => loadUpcomingAppointments(user?.id, 7)}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-medical-100 to-blue-100 rounded-2xl p-8 mx-auto max-w-md">
                      <Calendar className="mx-auto h-16 w-16 text-medical-400 mb-6" />
                      <p className="text-slate-600 font-semibold mb-6">
                        {searchTerm || filterStatus !== "all"
                          ? "No se encontraron citas con los filtros aplicados"
                          : "No tienes citas programadas para los próximos días"}
                      </p>
                      <Link
                        to="/appointments/new"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-medical-500 via-medical-600 to-medical-700 hover:from-medical-600 hover:via-medical-700 hover:to-medical-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Agendar nueva cita
                      </Link>
                    </div>
                  </div>
                ) : (
                  <UpcomingAppointments
                    appointments={filteredAppointments}
                    showActions={true}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar modernizado */}
          <div className="space-y-6">
            {/* Próxima cita modernizada */}
            {upcomingAppointments.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-medical-700 bg-clip-text text-transparent mb-6">
                  Próxima Cita
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-slate-50/80 rounded-lg p-3">
                    <Calendar className="h-5 w-5 text-medical-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {formatters.formatDateTime(
                        upcomingAppointments[0].dateTime
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-50/80 rounded-lg p-3">
                    <HeaderUserAvatar
                      size="xs"
                      showInitials={false}
                      className="ring-2 ring-medical-200"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {upcomingAppointments[0].doctorName}
                    </span>
                  </div>
                  <div className="bg-slate-50/80 rounded-lg p-3">
                    <span className="text-sm font-medium text-slate-700">
                      {formatters.formatSpecialty(
                        upcomingAppointments[0].specialty
                      )}
                    </span>
                  </div>
                  <Link
                    to={`/appointments/${upcomingAppointments[0].id}`}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            )}

            {/* Recordatorios modernizados */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-200/50 p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-6">
                Recordatorios Importantes
              </h3>
              <ul className="space-y-3 text-sm text-blue-800 font-medium">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Llega 15 minutos antes de tu cita</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Trae tu identificación oficial</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cancela con 2 horas de anticipación</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Mantén actualizada tu información</span>
                </li>
              </ul>
            </div>

            {/* Contacto de emergencia modernizado */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200/50 p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">
                Emergencias Médicas
              </h3>
              <p className="text-sm text-red-800 font-medium mb-6">
                Para emergencias médicas inmediatas, contacta al:
              </p>
              <a
                href="tel:911"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                📞 911
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
