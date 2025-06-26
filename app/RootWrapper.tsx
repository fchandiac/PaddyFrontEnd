'use client';

import { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { UserProvider } from '@/context/UserContext';
import { useSplashScreen } from '@/hooks/useSplashScreen';
import SplashScreen from '@/components/SplashScreen/SplashScreen';

export default function RootWrapper({ children }: { children: ReactNode }) {
  const userState = useUser();
  const { showSplash, hideSplash } = useSplashScreen(8000); // 8 segundos

  // Si hay que mostrar el splash, renderizarlo
  if (showSplash) {
    return <SplashScreen onComplete={hideSplash} duration={8000} />;
  }

  // Una vez completado el splash, mostrar el contenido normal
  return <UserProvider value={userState}>{children}</UserProvider>;
}
