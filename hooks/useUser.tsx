'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { getUserByEmail } from '@/app/actions/user';
import { useAlertContext } from '@/context/AlertContext';
import { User } from '@/types/user';

export const useUser = () => {
  const { data: session, status } = useSession();
  const { showAlert } = useAlertContext();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRetried, setHasRetried] = useState(false); // 👉 controlamos si ya reintentó

  const fetchUser = useCallback(async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    const response = await getUserByEmail(session.user.email);

    if (response?.error) {
      if (!hasRetried) {
        // 🔁 Intentamos una segunda vez
        setHasRetried(true);
        await fetchUser();
      } else {
        showAlert(response.error, 'error');
        setUser(null);
        setLoading(false);
      }
    } else {
      setUser(response);
      setLoading(false);
    }
  }, [session?.user?.email, showAlert, hasRetried]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setHasRetried(false); // reinicia flag cuando hay sesión nueva
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [status, session?.user?.email, fetchUser]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    refreshUser: fetchUser,
  };
};
