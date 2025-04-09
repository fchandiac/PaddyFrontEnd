import NextAuth, { Session} from 'next-auth';
import authConfig from '@/auth.config';


export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: 'lucho',
  session: {
    strategy: 'jwt',
  },

  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
 
      return token;
    },
    async session({ session, token }) {
    
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
