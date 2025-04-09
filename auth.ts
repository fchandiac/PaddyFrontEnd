import NextAuth, { Session } from 'next-auth';
import authConfig from '@/auth.config';


export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },

  trustHost: true,
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      return token;
    },
    session: async ({ session, token }) => {
      return session;
    },
    signIn: async ({ user, account, profile, email, credentials }) => {
      return true;
    },
  },
  pages: {
    signIn: '/',
  },

  events: {
    signIn: async ({ user, account }) => {},
    signOut: async (user) => {},
  },

  ...authConfig,
});
