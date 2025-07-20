
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      role: string;
      name?: string;
      accessToken?: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    email: string;
    role: string;
    accessToken?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('🔑 JWT callback - usuario recibido:', user);
        
        // Asegurarse de que tenemos un id válido
        if (user.id === undefined) {
          throw new Error('User ID is undefined');
        }
        
        // Convertir explícitamente el id a número si viene como string
        token.id = typeof user.id === 'string' ? parseInt(user.id, 10) : (user.id as number);
        token.email = user.email as string;
        token.role = (user as any).role as string;
        token.accessToken = (user as any).accessToken as string; // Agregar token
        
        console.log('🔑 JWT callback - token creado:', {
          id: token.id,
          email: token.email,
          role: token.role,
          hasAccessToken: !!token.accessToken
        });
      }
      return token;
    },
    async session({ session, token }) {
      console.log('🔑 Session callback - token recibido:', {
        id: token.id,
        email: token.email,
        role: token.role,
        hasAccessToken: !!token.accessToken
      });
      
      const sessionResult = {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          accessToken: token.accessToken, // Agregar token a la sesión
        }
      } as Session;
      
      console.log('🔑 Session callback - sesión final:', {
        userId: sessionResult.user.id,
        email: sessionResult.user.email,
        role: sessionResult.user.role,
        hasAccessToken: !!sessionResult.user.accessToken
      });
      
      return sessionResult;
    },
    signIn: async ({ user }) => {
      // Verificar que el usuario tiene un ID válido
      if (!user?.id) {
        console.error('Login attempt with invalid user ID');
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: '/',
  },
  events: {
    signIn: async ({ user }) => {
      console.log('Usuario ha iniciado sesión:', user);
    },
  },
  ...authConfig,
});
