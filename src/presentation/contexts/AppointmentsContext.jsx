/**
 * Context de Citas Médicas - Manejo global del estado de las citas
 * Implementa Context API con useReducer para gestión de citas
 */
import { useReducer } from "react";
import {
  APPOINTMENTS_ACTIONS,
  INITIAL_APPOINTMENTS_STATE,
} from "../../shared/types/appointments";
import { AppointmentsContext } from "./AppointmentsContext";

// Reducer para manejar las acciones de estado
const appointmentsReducer = (state, action) => {
  switch (action.type) {
    case APPOINTMENTS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case APPOINTMENTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      };

    case APPOINTMENTS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.SET_APPOINTMENTS:
      return {
        ...state,
        appointments: action.payload.appointments,
        isLoading: false,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.SET_UPCOMING_APPOINTMENTS:
      return {
        ...state,
        upcomingAppointments: action.payload.appointments,
        isLoading: false,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [action.payload.appointment, ...state.appointments],
        upcomingAppointments: [
          action.payload.appointment,
          ...state.upcomingAppointments,
        ].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
        error: null,
      };

    case APPOINTMENTS_ACTIONS.UPDATE_APPOINTMENT: {
      const updatedAppointments = state.appointments.map((apt) =>
        apt.id === action.payload.appointment.id
          ? action.payload.appointment
          : apt
      );

      const updatedUpcoming = state.upcomingAppointments.map((apt) =>
        apt.id === action.payload.appointment.id
          ? action.payload.appointment
          : apt
      );

      return {
        ...state,
        appointments: updatedAppointments,
        upcomingAppointments: updatedUpcoming,
      };
    }

    case APPOINTMENTS_ACTIONS.REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter(
          (apt) => apt.id !== action.payload.appointmentId
        ),
        upcomingAppointments: state.upcomingAppointments.filter(
          (apt) => apt.id !== action.payload.appointmentId
        ),
        selectedAppointment:
          state.selectedAppointment?.id === action.payload.appointmentId
            ? null
            : state.selectedAppointment,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.SET_AVAILABLE_DOCTORS:
      return {
        ...state,
        availableDoctors: action.payload.doctors,
        isLoading: false,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.SET_AVAILABLE_TIME_SLOTS:
      return {
        ...state,
        availableTimeSlots: action.payload.timeSlots,
        isLoading: false,
        error: null,
      };

    case APPOINTMENTS_ACTIONS.SET_SELECTED_APPOINTMENT:
      return {
        ...state,
        selectedAppointment: action.payload.appointment,
      };

    default:
      return state;
  }
};

// Provider Component
export const AppointmentsProvider = ({ children, appointmentUseCases }) => {
  const [state, dispatch] = useReducer(
    appointmentsReducer,
    INITIAL_APPOINTMENTS_STATE
  );

  // Acciones del contexto
  const setLoading = (isLoading) => {
    dispatch({
      type: APPOINTMENTS_ACTIONS.SET_LOADING,
      payload: { isLoading },
    });
  };

  const setError = (error) => {
    dispatch({
      type: APPOINTMENTS_ACTIONS.SET_ERROR,
      payload: { error },
    });
  };

  const clearError = () => {
    dispatch({ type: APPOINTMENTS_ACTIONS.CLEAR_ERROR });
  };

  const loadUserAppointments = async (userId) => {
    try {
      setLoading(true);
      const appointments = await appointmentUseCases.getUserAppointments(
        userId
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.SET_APPOINTMENTS,
        payload: { appointments },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const loadUpcomingAppointments = async (userId, days = 30) => {
    try {
      setLoading(true);
      const appointments = await appointmentUseCases.getUpcomingAppointments(
        userId,
        days
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.SET_UPCOMING_APPOINTMENTS,
        payload: { appointments },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const createAppointment = async (appointmentData, userId) => {
    try {
      setLoading(true);
      const result = await appointmentUseCases.createAppointment(
        appointmentData,
        userId
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.ADD_APPOINTMENT,
        payload: { appointment: result.appointment },
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const cancelAppointment = async (appointmentId, userId) => {
    try {
      setLoading(true);
      await appointmentUseCases.cancelAppointment(appointmentId, userId);

      dispatch({
        type: APPOINTMENTS_ACTIONS.REMOVE_APPOINTMENT,
        payload: { appointmentId },
      });

      return { success: true, message: "Cita cancelada exitosamente" };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const rescheduleAppointment = async (appointmentId, newDateTime, userId) => {
    try {
      setLoading(true);
      const result = await appointmentUseCases.rescheduleAppointment(
        appointmentId,
        newDateTime,
        userId
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.UPDATE_APPOINTMENT,
        payload: { appointment: result.appointment },
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const loadAvailableDoctors = async (specialty, date) => {
    try {
      setLoading(true);
      const doctors = await appointmentUseCases.getAvailableDoctors(
        specialty,
        date
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.SET_AVAILABLE_DOCTORS,
        payload: { doctors },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const loadAvailableTimeSlots = async (doctorId, date) => {
    try {
      setLoading(true);
      const timeSlots = await appointmentUseCases.getAvailableTimeSlots(
        doctorId,
        date
      );

      dispatch({
        type: APPOINTMENTS_ACTIONS.SET_AVAILABLE_TIME_SLOTS,
        payload: { timeSlots },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const selectAppointment = (appointment) => {
    dispatch({
      type: APPOINTMENTS_ACTIONS.SET_SELECTED_APPOINTMENT,
      payload: { appointment },
    });
  };

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    // Acciones
    loadUserAppointments,
    loadUpcomingAppointments,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    loadAvailableDoctors,
    loadAvailableTimeSlots,
    selectAppointment,
    clearError,
  };

  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
};
