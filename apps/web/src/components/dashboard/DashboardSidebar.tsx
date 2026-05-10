'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { User } from 'next-auth'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '◯' },
  { href: '/dashboard/bookings', label: 'Randevular', icon: '◷' },
  { href: '/dashboard/event-types', label: 'Randevu Tipleri', icon: '◬' },
  { href: '/dashboard/availability', label: 'Müsaitlik', icon: '◭' },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: '◎' },
]

interface DashboardSidebarProps {
  user: User | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="brand">
          <div className="brand-dot" />
          <span className="brand-name">CallRoom</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            {user.image && (
              <img src={user.image} alt={user.name || ''} className="user-avatar" />
            )}
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button onClick={() => signOut()} className="signout-btn">
          Çıkış yap
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
        }
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-primary);
        }
        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.875rem;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 0.75rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.15s;
        }
        .nav-item:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: var(--primary-bg);
          color: var(--text-primary);
          font-weight: 500;
        }
        .nav-icon {
          font-size: 1rem;
          opacity: 0.7;
        }
        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-email {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .signout-btn {
          width: 100%;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .signout-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
      `}</style>
    </aside>
  )
}