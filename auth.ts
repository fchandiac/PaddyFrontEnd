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

        return{
          id: '1',
          email: 'a@e.com',
          role: 'admin',
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
