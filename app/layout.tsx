// app/layout.tsx
import MuiProvider from '../MUI/MuiProvider';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Bitácora Vehicular',
  description: 'Gestión de vehículos y servicios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <MuiProvider>{children}</MuiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
