/**
 * Hook personalizado para gestión de autenticación
 * Proporciona funciones adicionales y validaciones
 */
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { storageService } from '../../infrastructure/services/StorageService';

export const useAuthOperations = () => {
  const auth = useAuth();
  const [rememberEmail, setRememberEmail] = useState('');

  // Cargar email recordado al montar el componente
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const savedEmail = await storageService.getItem('remember_email');
        if (savedEmail) {
          setRememberEmail(savedEmail);
        }
      } catch (error) {
        console.warn('No se pudo cargar el email recordado:', error);
      }
    };

    loadRememberedEmail();
  }, []);

  // Función mejorada de login con manejo de "recordarme"
  const loginWithRemember = async (email, password, remember = false) => {
    const result = await auth.login(email, password);
    
    if (remember) {
      await storageService.setItem('remember_email', email);
    } else {
      await storageService.removeItem('remember_email');
    }
    
    setRememberEmail(remember ? email : '');
    return result;
  };

  // Función de logout con limpieza completa
  const logoutCompletely = async () => {
    try {
      await auth.logout();
      
      // Limpiar datos adicionales si es necesario
      await storageService.removeItem('user_preferences');
      await storageService.removeItem('temp_appointment_data');
      
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  // Verificar si el token está próximo a expirar
  const isTokenNearExpiry = async () => {
    try {
      const token = await storageService.getItem('auth_token');
      if (!token) return false;

      // Decodificar el token JWT (simplificado)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir a millisegundos
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      return (expiry - now) < fiveMinutes;
    } catch (_error) {
      return false;
    }
  };

  // Renovar token automáticamente
  const renewTokenIfNeeded = async () => {
    try {
      const nearExpiry = await isTokenNearExpiry();
      
      if (nearExpiry) {
        // Intentar renovar el token
        await auth.getCurrentUser(); // Esto renovará el token si es válido
        return true;
      }
      
      return false;
    } catch (_error) {
      // Si falla la renovación, hacer logout
      await logoutCompletely();
      return false;
    }
  };

  return {
    ...auth,
    rememberEmail,
    loginWithRemember,
    logoutCompletely,
    isTokenNearExpiry,
    renewTokenIfNeeded
  };
};