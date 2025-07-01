// app/layout.tsx
import MuiProvider from "../MUI/MuiProvider";
import { AlertProvider } from "@/context/AlertContext";
import RootWrapper from "./RootWrapper"; // 👈 Nuevo archivo que usará el hook y envolverá el resto
import { ReceptionDataProvider } from "@/context/ReceptionDataContext";
import { SessionProvider } from 'next-auth/react';
import '@/app/globals.css';

export const metadata = {
  title: "Paddy AyG",
  description: "Arrocera Aparicio y García Ltda.",
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', type: 'image/png' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
        <MuiProvider>
          <AlertProvider>
            <RootWrapper>
              <ReceptionDataProvider>{children}</ReceptionDataProvider>
            </RootWrapper>
          </AlertProvider>
        </MuiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
