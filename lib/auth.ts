import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Development Login",
      credentials: {},
      async authorize() {
        // Only allow in development
        if (process.env.NODE_ENV !== "development") return null;

        return {
          id: "dev-user-id",
          name: "Dev User",
          email: "dev@biyeprofile.com",
          image: "https://ui-avatars.com/api/?name=Dev+User",
          role: "admin",
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Upsert user manually avoiding use of PrismaAdapter to adhere strictly to the MVP DB plan
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          }
        });
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      const email = token.email || user?.email;

      // If we are signing in, updating, or if we are missing critical session data (like username)
      // we fetch from the DB to ensure the session is not stale.
      if (user || trigger === "update" || (email && !token.username)) {
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            // Use role from user object (dev login) or from database
            token.role = (user as { role?: string })?.role || dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | null;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
})
