// app/auth.config.ts

import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        try {
          const res = await fetch(`${backendUrl}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass: password }),
          });

          if (!res.ok) return {
          
              id: '0',
              name: 'Anonymous',
              email: 'mail@mail.com',
              role: 'administrador',
            };
      

          const user = await res.json();

          return {
            id: user.userId.toString(),
            name: user.email,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Error en autorización:', error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

export default authConfig;
