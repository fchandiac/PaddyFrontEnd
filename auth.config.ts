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
        console.log('---[AUTH DEBUG]---');
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
          console.log('Status de respuesta:', res.status);
          const responseText = await res.text();
          console.log('Texto de respuesta del backend:', responseText);
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
          console.log('Usuario recibido del backend:', user);
          console.log('🔑 Access token del backend:', user.access_token);
          
          // Asegurarse de que tenemos todos los datos necesarios
          if (!user.userId || !user.email || !user.role) {
            console.error('Datos de usuario incompletos:', user);
            return null;
          }
          
          const userObject = {
            id: user.userId,
            email: user.email,
            role: user.role,
            name: user.name || '',
            accessToken: user.access_token, // Agregar el token
          };
          
          console.log('🔑 Usuario que se retorna con token:', userObject);
          
          return userObject;
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
