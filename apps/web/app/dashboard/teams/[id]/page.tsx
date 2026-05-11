'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Crown, GripVertical, X } from 'lucide-react'

interface TeamMember {
  id: string
  role: string
  priority: number
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    handle: string
  }
}

interface TeamEventType {
  id: string
  routingType: string
  eventType: {
    id: string
    title: string
    slug: string
    durationMin: number
    color: string
  }
}

interface Team {
  id: string
  name: string
  slug: string
  members: TeamMember[]
  eventTypes: TeamEventType[]
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [teamId, setTeamId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setTeamId(p.id))
  }, [params])

  useEffect(() => {
    if (!teamId) return

    fetch(`/api/teams/${teamId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setTeam(data)
        }
        setLoading(false)
      })
  }, [teamId])

  const removeMember = async (userId: string) => {
    if (!confirm('Remove this member from the team?')) return

    const res = await fetch(`/api/teams/${teamId}/members?userId=${userId}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      setTeam(prev => prev ? {
        ...prev,
        members: prev.members.filter(m => m.user.id !== userId)
      } : null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{
          height: '24px',
          width: '100px',
          background: 'var(--surface2)',
          borderRadius: 'var(--radius-sm)',
          animation: 'pulse 1.5s infinite',
          marginBottom: '1rem'
        }} />
        <div style={{
          height: '32px',
          width: '200px',
          background: 'var(--surface2)',
          borderRadius: 'var(--radius-sm)',
          animation: 'pulse 1.5s infinite'
        }} />
        <style jsx>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Team not found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <Link href="/dashboard/teams">Back to teams</Link>
      </div>
    )
  }

  const currentUserMembership = team.members.find(m => m.user.id === null)
  const isAdmin = currentUserMembership?.role === 'admin'

  return (
    <div className="team-detail-page">
      <header className="page-header">
        <Link href="/dashboard/teams" className="back-btn">
          <ArrowLeft size={16} />
          Back to teams
        </Link>
      </header>

      <div className="team-header">
        <div className="team-avatar">
          {team.name.charAt(0).toUpperCase()}
        </div>
        <div className="team-info">
          <h1>{team.name}</h1>
          <span className="team-slug">/{team.slug}</span>
        </div>
      </div>

      <div className="team-sections">
        <section className="section">
          <div className="section-header">
            <h2>
              <Users size={18} />
              Team Members
            </h2>
            <span className="count">{team.members.length}</span>
          </div>

          <div className="members-list">
            {team.members.map(member => (
              <div key={member.id} className="member-row">
                <div className="member-avatar">
                  {member.user.image ? (
                    <img src={member.user.image} alt={member.user.name || ''} />
                  ) : (
                    (member.user.name || member.user.email).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="member-info">
                  <span className="member-name">
                    {member.user.name || 'Unnamed'}
                    {member.role === 'admin' && (
                      <span className="admin-badge">
                        <Crown size={10} />
                        Admin
                      </span>
                    )}
                  </span>
                  <span className="member-email">{member.user.email}</span>
                </div>
                {member.role !== 'admin' && (
                  <button
                    className="remove-btn"
                    onClick={() => removeMember(member.user.id)}
                    title="Remove member"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>
              <GripVertical size={18} />
              Team Event Types
            </h2>
            <span className="count">{team.eventTypes.length}</span>
          </div>

          {team.eventTypes.length === 0 ? (
            <div className="empty-section">
              <p>No team event types yet</p>
              <p className="empty-hint">Add event types from your event types page</p>
            </div>
          ) : (
            <div className="event-types-list">
              {team.eventTypes.map(tet => (
                <div key={tet.id} className="event-type-row">
                  <div className="et-color" style={{ background: tet.eventType.color }} />
                  <div className="et-info">
                    <span className="et-title">{tet.eventType.title}</span>
                    <span className="et-meta">
                      {tet.eventType.durationMin}min • {tet.routingType === 'round_robin' ? 'Round Robin' : 'Collective'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .team-detail-page {
          padding: 2rem;
          max-width: 800px;
        }
        .page-header {
          margin-bottom: 1.5rem;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
        }
        .back-btn:hover { color: var(--text-primary); }
        .team-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .team-avatar {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: var(--primary-bg);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }
        .team-info h1 {
          font-size: 1.5rem;
          margin: 0 0 0.25rem;
        }
        .team-slug {
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }
        .team-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
        }
        .count {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          background: var(--surface2);
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .members-list, .event-types-list {
          display: flex;
          flex-direction: column;
        }
        .member-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .member-row:last-child { border-bottom: none; }
        .member-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--surface2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          overflow: hidden;
          flex-shrink: 0;
        }
        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .member-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .member-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.375rem;
          background: var(--primary-bg);
          color: var(--primary);
          border-radius: var(--radius-sm);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .member-email {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
        }
        .remove-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .remove-btn:hover {
          background: var(--error-bg);
          border-color: var(--error);
          color: var(--error);
        }
        .empty-section {
          padding: 2rem;
          text-align: center;
        }
        .empty-section p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .empty-hint {
          font-size: 0.8125rem;
          color: var(--text-tertiary) !important;
          margin-top: 0.25rem !important;
        }
        .event-type-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .event-type-row:last-child { border-bottom: none; }
        .et-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .et-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .et-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .et-meta {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  )
}