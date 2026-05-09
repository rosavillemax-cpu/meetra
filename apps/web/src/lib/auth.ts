import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

// Trim newlines that Vercel sometimes appends to env values
const trimEnv = (key: string) => process.env[key]?.trim() ?? undefined

// Lazy singleton — avoids Prisma initialization errors at module load time
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: trimEnv('AUTH_SECRET'),
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: trimEnv('AUTH_GOOGLE_ID')!,
      clientSecret: trimEnv('AUTH_GOOGLE_SECRET')!,
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
    async redirect({ url, baseUrl }) {
      // Always use clean baseUrl without trailing newlines
      const cleanBase = baseUrl.trim()
      if (url.startsWith('/')) return `${cleanBase}${url}`
      if (url.startsWith(cleanBase)) return url
      return `${cleanBase}/dashboard`
    },
  },
  trustHost: true,
})
