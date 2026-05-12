import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

const trimEnv = (key: string) => {
  const val = process.env[key]
  if (!val || val.trim() === '') return undefined
  return val.trim()
}

const googleId = trimEnv('AUTH_GOOGLE_ID')
const googleSecret = trimEnv('AUTH_GOOGLE_SECRET')

if (!googleId || !googleSecret) {
  console.error('AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are required for authentication to work')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: trimEnv('AUTH_SECRET') || 'fallback-secret-for-development-only-change-in-production',
  providers: [
    Google({
      clientId: googleId || '',
      clientSecret: googleSecret || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.name = token.name
        ;(session.user as any).isReturning = token.isReturning ?? false
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          let dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (!dbUser && user.email) {
            const handle = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'
            const existing = await prisma.user.findUnique({ where: { handle } })
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                image: user.image,
                handle: existing ? `${handle}-${Date.now()}` : handle,
              },
            })
          }
          if (dbUser) {
            if (token.sub !== dbUser.id) token.sub = dbUser.id
          }
        } catch (error) {
          console.error('Auth JWT callback error:', error)
        }
      }
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { name: true },
        })
        if (dbUser?.name) {
          token.name = dbUser.name
        }
        const isReturning = await prisma.booking.count({ where: { hostId: token.sub } }) > 0
        token.isReturning = isReturning
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      const cleanBase = baseUrl.trim()
      if (url.startsWith('/')) return `${cleanBase}${url}`
      if (url.startsWith(cleanBase)) return url
      return `${cleanBase}/dashboard`
    },
  },
  trustHost: true,
})
