import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

const trimEnv = (key: string) => process.env[key]?.trim() ?? undefined

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: trimEnv('AUTH_SECRET'),
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
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
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
          if (dbUser && token.sub !== dbUser.id) {
            token.sub = dbUser.id
          }
        } catch (error) {
          console.error('Auth JWT callback error:', error)
        }
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
