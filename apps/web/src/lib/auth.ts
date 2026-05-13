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

export type SubscriptionStatus = 'trialing' | 'active' | 'expired' | 'canceled'
export type Plan = 'free_trial' | 'starter' | 'pro'

export interface TrialInfo {
  status: SubscriptionStatus
  plan: Plan
  trialStartedAt: Date | null
  trialEndsAt: Date | null
}

export async function getTrialStatus(userId: string): Promise<TrialInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      trialStartedAt: true,
      trialEndsAt: true,
      subscriptionStatus: true,
      plan: true,
    },
  })

  if (!user) {
    return { status: 'expired', plan: 'free_trial', trialStartedAt: null, trialEndsAt: null }
  }

  return {
    status: (user.subscriptionStatus as SubscriptionStatus) || 'trialing',
    plan: (user.plan as Plan) || 'free_trial',
    trialStartedAt: user.trialStartedAt,
    trialEndsAt: user.trialEndsAt,
  }
}

export function isTrialValid(trialInfo: TrialInfo): boolean {
  if (trialInfo.status === 'active') return true
  if (trialInfo.status === 'trialing' && trialInfo.trialEndsAt) {
    return new Date() < trialInfo.trialEndsAt
  }
  return false
}

export function isTrialExpired(trialInfo: TrialInfo): boolean {
  return !isTrialValid(trialInfo)
}

export function getDaysRemaining(trialInfo: TrialInfo): number | null {
  if (trialInfo.status !== 'trialing' || !trialInfo.trialEndsAt) return null
  const now = new Date()
  if (now >= trialInfo.trialEndsAt) return 0
  const diff = trialInfo.trialEndsAt.getTime() - now.getTime()
  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

const TRIAL_DAYS = 14

function startTrial(): { trialStartedAt: Date; trialEndsAt: Date; subscriptionStatus: SubscriptionStatus; plan: Plan } {
  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
  return {
    trialStartedAt: now,
    trialEndsAt,
    subscriptionStatus: 'trialing',
    plan: 'free_trial',
  }
}

function isNewUser(dbUser: { trialStartedAt: Date | null }): boolean {
  return dbUser.trialStartedAt === null
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
            const trial = startTrial()
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                image: user.image,
                handle: existing ? `${handle}-${Date.now()}` : handle,
                ...trial,
              },
            })
          }
          if (dbUser && isNewUser(dbUser) && account?.provider) {
            const trial = startTrial()
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { ...trial },
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
          select: { name: true, trialStartedAt: true, trialEndsAt: true, subscriptionStatus: true, plan: true },
        })
        if (dbUser?.name) {
          token.name = dbUser.name
        }
        const isReturning = await prisma.booking.count({ where: { hostId: token.sub } }) > 0
        token.isReturning = isReturning
        token.trialStartedAt = dbUser?.trialStartedAt
        token.trialEndsAt = dbUser?.trialEndsAt
        token.subscriptionStatus = dbUser?.subscriptionStatus
        token.plan = dbUser?.plan
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