import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
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
  },
  events: {
    async signIn({ user }) {
      try {
        const cookieStore = await cookies()
        const guestSessionId = cookieStore.get("biye_guest_sid")?.value
        if (guestSessionId && user.id) {
          // Verify the session actually exists before logging conversion
          const session = await prisma.guestSession.findUnique({
            where: { sessionId: guestSessionId }
          })
          if (session) {
            await prisma.guestActivity.create({
              data: {
                sessionId: guestSessionId,
                type: "GUEST_CONVERTED",
                path: "/api/auth/callback/google",
                metadata: { userId: user.id },
              },
            })
          }
        }
      } catch {
        // Non-critical: don't break sign-in if tracking fails
      }
    }
  }
})
