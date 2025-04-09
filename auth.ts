import NextAuth, { Session} from 'next-auth';
import authConfig from '@/auth.config';


export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },

  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        // @ts-ignore
        session.user = token.user  
      }
      return session;
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
