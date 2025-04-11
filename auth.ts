import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const isProd = process.env.NODE_ENV === 'production';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

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

          if (!res.ok) return null;

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

  session: { strategy: 'jwt' },
  trustHost: true,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || '';
        token.email = user.email || '';
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProd,
      },
    },
  },

  pages: {
    signIn: '/',
  },

  events: {
    signIn: async ({ user, account }) => {
      console.log('User signed in:', user);
    },
    signOut: async (user) => {
      console.log('User signed out:', user);
    },
  },
});
