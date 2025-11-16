/**
 * Hook personalizado para el contexto de citas médicas
 */
import { useContext } from "react";
import { AppointmentsContext } from "../contexts/AppointmentsContext";

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);

  if (context === undefined) {
    throw new Error(
      "useAppointments debe ser usado dentro de un AppointmentsProvider"
    );
  }

  return context;
};