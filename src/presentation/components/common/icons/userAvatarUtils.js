/**
 * Utilidades para avatares de usuario
 * Funciones auxiliares separadas para mantener Fast Refresh
 */

// Hook para generar avatares dinámicos basados en el usuario
export const useUserAvatar = (user) => {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const generateAvatarProps = () => {
    if (!user) return { variant: "light" };

    // Generar variante basada en el ID del usuario
    const variants = ["gradient", "light"];
    const variantIndex = user.id ? user.id % variants.length : 0;

    return {
      variant: variants[variantIndex],
      "data-initials": getInitials(user.fullName || user.firstName),
      title: user.fullName || user.email || "Usuario",
    };
  };

  return {
    initials: getInitials(user?.fullName || user?.firstName),
    avatarProps: generateAvatarProps(),
  };
};