/**
 * Componente de Acciones Rápidas
 * Proporciona botones de acceso rápido a las funciones principales
 */
import { Link } from "react-router-dom";
import { Plus, Calendar, Clock, User, FileText, Settings } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Nueva Cita",
      description: "Agendar una nueva cita médica",
      icon: Plus,
      href: "/appointments/new",
      color: "blue",
      primary: true,
    },
    {
      title: "Mis Citas",
      description: "Ver todas mis citas programadas",
      icon: Calendar,
      href: "/appointments",
      color: "green",
    },
    {
      title: "Historial",
      description: "Consultar mi historial médico",
      icon: FileText,
      href: "/medical-history",
      color: "purple",
    },
    {
      title: "Mi Perfil",
      description: "Actualizar mi información personal",
      icon: User,
      href: "/profile",
      color: "orange",
    },
  ];

  const getColorClasses = (color, isPrimary = false) => {
    if (isPrimary) {
      return {
        bg: "bg-blue-600 hover:bg-blue-700",
        text: "text-white",
        icon: "text-white",
      };
    }

    const colorMap = {
      blue: {
        bg: "bg-blue-50 hover:bg-blue-100",
        text: "text-blue-900",
        icon: "text-blue-600",
      },
      green: {
        bg: "bg-green-50 hover:bg-green-100",
        text: "text-green-900",
        icon: "text-green-600",
      },
      purple: {
        bg: "bg-purple-50 hover:bg-purple-100",
        text: "text-purple-900",
        icon: "text-purple-600",
      },
      orange: {
        bg: "bg-orange-50 hover:bg-orange-100",
        text: "text-orange-900",
        icon: "text-orange-600",
      },
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Acciones Rápidas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          const colors = getColorClasses(action.color, action.primary);

          return (
            <Link
              key={action.title}
              to={action.href}
              className={`block p-6 rounded-lg transition-colors duration-200 ${colors.bg}`}
            >
              <div className="flex items-center mb-3">
                <IconComponent className={`h-6 w-6 ${colors.icon} mr-3`} />
                <h4 className={`font-semibold ${colors.text}`}>
                  {action.title}
                </h4>
              </div>
              <p
                className={`text-sm ${
                  action.primary ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Indicadores adicionales */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Horario de Atención
              </p>
              <p className="text-sm text-gray-600">
                Lun-Vie: 8:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">Cancelaciones</p>
              <p className="text-sm text-gray-600">
                Con 2 horas de anticipación
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">Soporte</p>
              <p className="text-sm text-gray-600">
                <a
                  href="tel:+5255123456"
                  className="text-blue-600 hover:underline"
                >
                  +52 55 1234-5678
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
