'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshUser: () => void; 
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: UserContextType;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de <UserProvider>');
  }
  return context;
};
