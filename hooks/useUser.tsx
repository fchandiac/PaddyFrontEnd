'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mockUser: User = {
    id: 1,
    name: 'Admin',
    email: 'a@e.com',
    //@ts-ignore
    pass: '1234',
    role: 'administrador',
  };

  const fetchUser = useCallback(async () => {
    setLoading(true);
    // Simula carga (opcional)
    await new Promise((res) => setTimeout(res, 300));
    setUser(mockUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser: fetchUser,
  };
};
