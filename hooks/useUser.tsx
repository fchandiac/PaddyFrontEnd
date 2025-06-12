'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types/user';
import { getUserByEmail } from '@/app/actions/user';

export const useUser = () => {
  const { data: session, status } = useSession(); // status: "loading" | "authenticated" | "unauthenticated"
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (status === 'loading') return;

      if (session?.user?.email) {
        // Primero intentamos usar la sesión directamente
        const basicUser: User = {
          email: session.user.email,
          name: session.user.name ?? '',
          id: 0,
          role: 'administrador'
        };

        setUser(basicUser);

        try {
          // Si necesitas más datos (rol, config, etc), los traes
          const dbUser = await getUserByEmail(session.user.email);
          setUser(dbUser);
        } catch (error) {
          console.error('Error cargando usuario desde DB:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [session, status]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser: async () => {
      if (session?.user?.email) {
        const refreshed = await getUserByEmail(session.user.email);
        setUser(refreshed);
      }
    },
  };
};
