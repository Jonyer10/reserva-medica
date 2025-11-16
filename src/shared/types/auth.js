/**
 * Constantes y tipos para el manejo de autenticación
 */

// Acciones del reducer de autenticación
export const AUTH_ACTIONS = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  RESTORE_SESSION: "RESTORE_SESSION",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Estado inicial del contexto de autenticación
export const INITIAL_AUTH_STATE = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};