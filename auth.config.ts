import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Simulación de autenticación sin conexión
        const { email, password } = credentials;

        if (email === 'admin@test.com' && password === '1234') {
          return {
            id: '123',
            name: 'Admin Test',
            email: 'admin@test.com',
            role: 'admin',
          };
        }

        // Credenciales inválidas
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
