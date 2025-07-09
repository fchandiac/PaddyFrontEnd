import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        console.log('Intentando autenticar con:', { email });
        console.log('URL del backend:', backendUrl);

        try {
          const res = await fetch(`${backendUrl}/auth/sign-in`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              email: email, 
              pass: password // CORRECTO: El backend espera 'pass', no 'password'
            }),
          });

          const responseText = await res.text();
          console.log('Respuesta del servidor:', responseText);

          if (!res.ok) {
            console.error('Error de autenticación. Status:', res.status);
            console.error('Respuesta:', responseText);
            return null;
          }

          let user;
          try {
            user = JSON.parse(responseText);
          } catch (e) {
            console.error('Error al parsear la respuesta:', e);
            return null;
          }

          console.log('Datos de usuario recibidos:', user);

          // Asegurarse de que tenemos todos los datos necesarios
          if (!user.userId || !user.email || !user.role) {
            console.error('Datos de usuario incompletos:', user);
            return null;
          }

          return {
            id: user.userId,
            email: user.email,
            role: user.role,
            name: user.name || '',
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
