/**
 * Constantes y tipos para el manejo de citas médicas
 */

// Acciones del reducer de citas
export const APPOINTMENTS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_APPOINTMENTS: "SET_APPOINTMENTS",
  SET_UPCOMING_APPOINTMENTS: "SET_UPCOMING_APPOINTMENTS",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  UPDATE_APPOINTMENT: "UPDATE_APPOINTMENT",
  REMOVE_APPOINTMENT: "REMOVE_APPOINTMENT",
  SET_AVAILABLE_DOCTORS: "SET_AVAILABLE_DOCTORS",
  SET_AVAILABLE_TIME_SLOTS: "SET_AVAILABLE_TIME_SLOTS",
  SET_SELECTED_APPOINTMENT: "SET_SELECTED_APPOINTMENT",
};

// Estado inicial del contexto de citas
export const INITIAL_APPOINTMENTS_STATE = {
  appointments: [],
  upcomingAppointments: [],
  availableDoctors: [],
  availableTimeSlots: [],
  isLoading: false,
  error: null,
  selectedAppointment: null,
};