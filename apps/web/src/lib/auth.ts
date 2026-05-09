import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// Trim newlines that Vercel sometimes appends to env values
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
    async redirect({ url, baseUrl }) {
      const cleanBase = baseUrl.trim()
      if (url.startsWith('/')) return `${cleanBase}${url}`
      if (url.startsWith(cleanBase)) return url
      return `${cleanBase}/dashboard`
    },
  },
  trustHost: true,
})
