'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types/user';

type UserRole = 'administrador' | 'contador' | 'operador';

function isValidRole(role: string): role is UserRole {
  return ['administrador', 'contador', 'operador'].includes(role);
}

export const useUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    // TEMPORAL: Usuario mock mientras no hay backend disponible
    if (!session?.user) {
      const mockUser: User = {
        id: 1001,
        email: 'admin@ayg.cl',
        name: 'Administrador Principal',
        role: 'administrador'
      };
      console.log('USANDO USUARIO MOCK TEMPORAL:', mockUser);
      setUser(mockUser);
      setLoading(false);
      return;
    }

    if (session?.user) {
      // Validar el role y asignar un valor por defecto si no es válido
      const role = isValidRole(session.user.role) ? session.user.role : 'operador';
      
      // La sesión ya contiene todos los datos necesarios del usuario
      const userFromSession: User = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || '',
        role: role,
      };
      
      setUser(userFromSession);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  const refreshUser = async () => {
    // La sesión se actualiza automáticamente con next-auth
    setLoading(true);
    setLoading(false);
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser
  };
};
