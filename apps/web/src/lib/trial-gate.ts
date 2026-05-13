import { redirect } from 'next/navigation'
import { auth, getTrialStatus, isTrialExpired } from './auth'
import { prisma } from './prisma'

export async function requireAuthWithTrial() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const trialInfo = await getTrialStatus(session.user.id)

  if (isTrialExpired(trialInfo)) {
    const hasEventTypes = await prisma.eventType.count({ where: { userId: session.user.id } }) > 0
    if (hasEventTypes) {
      redirect('/')
    }
  }

  return session
}