'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { TrialInfo } from '@/lib/auth'

export function TrialBanner() {
  const { data: session } = useSession()
  const trialInfo = (session?.user as any)?.trialInfo as TrialInfo | undefined

  if (!session?.user || !trialInfo) {
    return null
  }

  if (trialInfo.status === 'active' || trialInfo.status === 'canceled') {
    return null
  }

  if (trialInfo.status === 'expired') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
        color: '#fff',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '0.875rem'
      }}>
        <span>Your free trial has ended.</span>
        <Link
          href="/pricing"
          style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '0.375rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background 0.15s'
          }}
        >
          Choose a plan
        </Link>
      </div>
    )
  }

  const trialEndsAt = trialInfo.trialEndsAt ? new Date(trialInfo.trialEndsAt) : null
  if (!trialEndsAt) return null

  const now = new Date()
  const diff = trialEndsAt.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const isUrgent = daysRemaining <= 1

  return (
    <div style={{
      background: isUrgent
        ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
        : 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)',
      color: '#fff',
      padding: '0.625rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontSize: '0.8125rem',
      fontWeight: 500
    }}>
      {isUrgent ? (
        <span>Your free trial ends soon. <Link href="/pricing" style={{ color: '#fff', textDecoration: 'underline' }}>Upgrade now</Link></span>
      ) : (
        <span>Free trial: {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
      )}
    </div>
  )
}