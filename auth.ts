// app/auth.ts test

import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  trustHost: false,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? '';
        token.email = user.email ?? '';
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
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

  ...authConfig,
});
