import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

// Lazy singleton — avoids Prisma initialization errors at module load time
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Trim newlines that Vercel sometimes appends to env values
if (process.env.AUTH_URL) {
  process.env.AUTH_URL = process.env.AUTH_URL.trim()
}
if (process.env.AUTH_GOOGLE_ID) {
  process.env.AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID.trim()
}
if (process.env.AUTH_GOOGLE_SECRET) {
  process.env.AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET.trim()
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET?.trim(),
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
  },
  trustHost: true,
})
