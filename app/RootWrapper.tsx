'use client';

import { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { UserProvider } from '@/context/UserContext';

export default function RootWrapper({ children }: { children: ReactNode }) {
  const userState = useUser(); // 👈 estado y lógica del usuario

  return <UserProvider value={userState}>{children}</UserProvider>;
}
