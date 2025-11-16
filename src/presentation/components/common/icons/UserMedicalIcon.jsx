/**
 * Ícono de Usuario Médico Optimizado
 * Diseño específico para plataforma médica con gradiente azul suave
 */
import React from "react";

export const UserMedicalIcon = ({
  size = 24,
  className = "",
  variant = "gradient",
  ...props
}) => {
  const gradientId = `userMedicalGradient-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const baseClasses = "transition-all duration-300 ease-in-out";

  // Variantes de colores para diferentes contextos
  const variants = {
    gradient: {
      from: "#0ea5e9", // medical-500
      to: "#e0f2fe", // medical-100
      via: "#7dd3fc", // medical-300
    },
    solid: {
      from: "#0284c7", // medical-600
      to: "#0284c7",
      via: "#0284c7",
    },
    light: {
      from: "#bae6fd", // medical-200
      to: "#f0f9ff", // medical-50
      via: "#e0f2fe", // medical-100
    },
  };

  const currentVariant = variants[variant] || variants.gradient;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {/* Definición del gradiente */}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={currentVariant.from} stopOpacity="1" />
          <stop offset="50%" stopColor={currentVariant.via} stopOpacity="0.8" />
          <stop offset="100%" stopColor={currentVariant.to} stopOpacity="0.6" />
        </linearGradient>

        {/* Sombra suave */}
        <filter id={`shadow-${gradientId}`}>
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#0ea5e9"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      {/* Círculo de fondo con gradiente suave */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="url(#backgroundGradient)"
        opacity="0.1"
      />

      {/* Gradiente de fondo */}
      <defs>
        <radialGradient id="backgroundGradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.05" />
          <stop offset="70%" stopColor="#7dd3fc" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.01" />
        </radialGradient>
      </defs>

      {/* Cabeza del usuario */}
      <circle
        cx="12"
        cy="9"
        r="3.5"
        fill={`url(#${gradientId})`}
        filter={`url(#shadow-${gradientId})`}
        strokeWidth="0.5"
        stroke="#bae6fd"
        opacity="0.95"
      />

      {/* Cuerpo del usuario con forma más suave */}
      <path
        d="M6.5 18.5C6.5 15.5 9 13 12 13s5.5 2.5 5.5 5.5c0 .8-.2 1.5-.5 2H7c-.3-.5-.5-1.2-.5-2z"
        fill={`url(#${gradientId})`}
        filter={`url(#shadow-${gradientId})`}
        strokeWidth="0.5"
        stroke="#bae6fd"
        opacity="0.95"
      />

      {/* Cruz médica pequeña (opcional) */}
      {variant === "gradient" && (
        <g opacity="0.7">
          <path
            d="M18.5 4.5h1.5v2h-1.5v1.5h-2v-1.5h-1.5v-2h1.5v-1.5h2v1.5z"
            fill="#22c55e"
            opacity="0.8"
            transform="scale(0.7) translate(4, 2)"
          />
        </g>
      )}

      {/* Brillo sutil */}
      <ellipse
        cx="10"
        cy="7"
        rx="1"
        ry="1.5"
        fill="#ffffff"
        opacity="0.3"
        transform="rotate(-20 10 7)"
      />
    </svg>
  );
};

// Variantes predefinidas para diferentes contextos
export const UserAvatarMedical = (props) => (
  <UserMedicalIcon variant="gradient" size={32} {...props} />
);

export const UserIconLight = (props) => (
  <UserMedicalIcon variant="light" size={20} {...props} />
);

export const UserIconSolid = (props) => (
  <UserMedicalIcon variant="solid" size={16} {...props} />
);

export default UserMedicalIcon;
