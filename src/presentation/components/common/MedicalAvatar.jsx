/**
 * Componente Avatar Médico - Imagen de perfil optimizada
 * Combina ícono vectorial con iniciales y gradientes médicos
 */
import React from "react";
import { UserMedicalIcon } from "./icons/UserMedicalIcon";

export const MedicalAvatar = ({
  user,
  size = "md",
  showIcon = true,
  showInitials = true,
  className = "",
  onClick,
  ...props
}) => {
  // Tamaños predefinidos
  const sizes = {
    xs: { container: "w-6 h-6", icon: 16, text: "text-xs" },
    sm: { container: "w-8 h-8", icon: 20, text: "text-sm" },
    md: { container: "w-12 h-12", icon: 24, text: "text-base" },
    lg: { container: "w-16 h-16", icon: 32, text: "text-lg" },
    xl: { container: "w-20 h-20", icon: 40, text: "text-xl" },
  };

  const currentSize = sizes[size] || sizes.md;

  // Extraer iniciales del usuario
  const getInitials = () => {
    if (!user) return "U";
    const name = user.fullName || user.firstName || user.email || "";
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  // Determinar color de fondo basado en el usuario
  const getBackgroundStyle = () => {
    if (!user?.id) {
      return "bg-gradient-to-br from-medical-400 via-medical-300 to-medical-100";
    }

    const gradients = [
      "bg-gradient-to-br from-medical-500 via-medical-400 to-medical-200",
      "bg-gradient-to-br from-medical-600 via-medical-300 to-medical-100",
      "bg-gradient-to-br from-blue-500 via-medical-400 to-medical-100",
      "bg-gradient-to-br from-medical-400 via-blue-300 to-medical-50",
    ];

    return gradients[user.id % gradients.length];
  };

  const baseClasses = `
    medical-avatar-container avatar-shine gpu-accelerated
    relative inline-flex items-center justify-center
    ${currentSize.container}
    rounded-full overflow-hidden
    shadow-medical transition-all duration-300 ease-in-out
    hover:shadow-medical-lg hover:scale-105
    icon-medical-transition
    ${className}
  `;

  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseClasses} ${clickableClasses}`}
      onClick={onClick}
      {...props}
    >
      {/* Fondo con gradiente médico */}
      <div className={`absolute inset-0 ${getBackgroundStyle()} opacity-90`} />

      {/* Brillo sutil en la parte superior */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />

      {/* Contenido del avatar */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {showIcon ? (
          <UserMedicalIcon
            size={currentSize.icon}
            className="text-white/90 drop-shadow-sm"
            variant="solid"
          />
        ) : showInitials ? (
          <span
            className={`
            font-medical font-semibold text-white/95 
            ${currentSize.text}
            drop-shadow-sm tracking-tight
          `}
          >
            {getInitials()}
          </span>
        ) : (
          <div
            className={`
            ${currentSize.container} 
            bg-gradient-to-br from-medical-500/80 to-medical-300/60
            rounded-full
          `}
          />
        )}
      </div>

      {/* Indicador de estado online (opcional) */}
      {user?.isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

// Componente específico para header/navegación
export const HeaderUserAvatar = ({ user, onClick }) => (
  <MedicalAvatar
    user={user}
    size="sm"
    onClick={onClick}
    className="ring-2 ring-white/20 hover:ring-white/40"
  />
);

// Componente para sidebar o areas de perfil
export const ProfileAvatar = ({ user, onClick }) => (
  <MedicalAvatar
    user={user}
    size="lg"
    onClick={onClick}
    className="ring-4 ring-medical-100/50"
  />
);

// Componente mini para listas
export const MiniUserAvatar = ({ user, onClick }) => (
  <MedicalAvatar user={user} size="xs" showInitials={false} onClick={onClick} />
);

export default MedicalAvatar;
