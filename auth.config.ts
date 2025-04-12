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

        const res = await fetch(`${backendUrl}/auth/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, pass: password }),
        });

        if (!res.ok) {
          return null;
        }

        const user = await res.json();

        return {
          id: user.userId,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
