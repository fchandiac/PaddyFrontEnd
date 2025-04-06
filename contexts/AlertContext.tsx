'use client';
import React, { createContext, JSX, ReactNode, useContext } from 'react';

import { useAlert } from '../hooks/useAlert';

// Tipo del contexto
type AlertContextType = {
  showAlert: (message: string, severity: "success" | "error" | "info" | "warning") => void;
  AlertComponent: JSX.Element | null;
};

// Crear el contexto
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);

// Tipo de las props del Provider
type AlertProviderProps = {
  children: ReactNode;
};

// Crear el Provider
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const { showAlert, AlertComponent } = useAlert();

  return (
    <AlertContext.Provider value={{ showAlert, AlertComponent }}>
      {children}
      {AlertComponent}
    </AlertContext.Provider>
  );
};

// Hook para consumir el contexto de forma segura
export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext debe usarse dentro de AlertProvider');
  }
  return context;
};
