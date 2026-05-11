'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Users, ArrowRight, Copy } from 'lucide-react'

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

interface Team {
  id: string
  name: string
  slug: string
  members: TeamMember[]
  eventTypes: { eventType: { id: string; title: string } }[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teams')
      .then(r => r.json())
      .then(data => {
        setTeams(data)
        setLoading(false)
      })
  }, [])

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1000px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              height: '28px',
              width: '100px',
              background: 'var(--surface2)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '0.5rem',
              animation: 'pulse 1.5s infinite'
            }} />
            <div style={{
              height: '16px',
              width: '200px',
              background: 'var(--surface2)',
              borderRadius: 'var(--radius-sm)',
              animation: 'pulse 1.5s infinite'
            }} />
          </div>
        </div>
        <style jsx>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    )
  }

  return (
    <div className="teams-page">
      <header className="page-header">
        <div>
          <h1>Teams</h1>
          <p className="page-subtitle">Manage your team scheduling</p>
        </div>
        <Link href="/dashboard/teams/new" className="create-btn">
          <Plus size={16} />
          New team
        </Link>
      </header>

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={32} />
          </div>
          <h2>No teams yet</h2>
          <p>Create a team to start scheduling with multiple members</p>
          <Link href="/dashboard/teams/new" className="create-btn empty-btn">
            <Plus size={16} />
            Create team
          </Link>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team.id} className="team-card">
              <div className="team-header">
                <div className="team-avatar">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div className="team-info">
                  <h3>{team.name}</h3>
                  <span className="team-slug">/{team.slug}</span>
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copyLink(team.slug)}
                  title="Copy team link"
                >
                  <Copy size={14} />
                </button>
              </div>

              <div className="team-stats">
                <div className="stat">
                  <span className="stat-value">{team.members.length}</span>
                  <span className="stat-label">members</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{team.eventTypes.length}</span>
                  <span className="stat-label">event types</span>
                </div>
              </div>

              <div className="team-members">
                <span className="members-label">Members</span>
                <div className="members-list">
                  {team.members.slice(0, 4).map(member => (
                    <div key={member.id} className="member-avatar" title={member.user.name || member.user.email}>
                      {member.user.image ? (
                        <img src={member.user.image} alt={member.user.name || ''} />
                      ) : (
                        (member.user.name || member.user.email).charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}
                  {team.members.length > 4 && (
                    <div className="member-avatar more">+{team.members.length - 4}</div>
                  )}
                </div>
              </div>

              <Link href={`/dashboard/teams/${team.id}`} className="view-btn">
                Manage team
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .teams-page {
          padding: 2rem;
          max-width: 1000px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }
        .create-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.625rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .create-btn:hover { opacity: 0.9; }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
        }
        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.25rem;
          background: var(--surface2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
        }
        .empty-state h2 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        }
        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 1.75rem;
          font-size: 0.875rem;
        }
        .empty-btn {
          display: inline-flex !important;
          padding: 0.75rem 1.5rem !important;
          font-size: 0.9375rem !important;
        }
        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .team-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .team-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .team-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          background: var(--primary-bg);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .team-info {
          flex: 1;
          min-width: 0;
        }
        .team-info h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .team-slug {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .copy-btn {
          width: 32px;
          height: 32px;
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
        .copy-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .team-stats {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .stat {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .team-members {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .members-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .members-list {
          display: flex;
          margin-left: auto;
        }
        .member-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--surface2);
          border: 2px solid var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-left: -8px;
        }
        .member-avatar:first-child { margin-left: 0; }
        .member-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .member-avatar.more {
          background: var(--surface-hover);
          font-size: 0.625rem;
        }
        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          padding: 0.625rem 1rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s;
          margin-top: auto;
        }
        .view-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}