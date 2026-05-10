'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, CalendarDays, Clock4, CalendarClock, Settings, type LucideIcon } from 'lucide-react'
import type { User } from 'next-auth'

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/dashboard',              label: 'Overview',        Icon: LayoutDashboard },
  { href: '/dashboard/bookings',     label: 'Randevular',      Icon: CalendarDays },
  { href: '/dashboard/event-types',  label: 'Randevu Tipleri', Icon: Clock4 },
  { href: '/dashboard/availability', label: 'Müsaitlik',       Icon: CalendarClock },
  { href: '/dashboard/settings',     label: 'Ayarlar',         Icon: Settings },
]

interface DashboardSidebarProps {
  user: User | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="brand">
            <div className="brand-icon">C</div>
            <span className="brand-name">Callroom</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item ${pathname === href ? 'active' : ''}`}
            >
              <Icon size={16} className="nav-icon" />
              <span className="nav-label">{label}</span>
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
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <Link href="/" className="brand">
          <div className="brand-icon">C</div>
          <span className="brand-name">Callroom</span>
        </Link>
        {user?.image && (
          <img src={user.image} alt={user.name || ''} className="mobile-avatar" />
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`mobile-nav-item ${pathname === href ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <style jsx>{`
        /* ── Desktop sidebar ── */
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          flex-shrink: 0;
        }
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .brand-icon {
          width: 28px;
          height: 28px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.25);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--primary);
          flex-shrink: 0;
        }
        .brand-name {
          font-weight: 600;
          letter-spacing: 0.02em;
          font-size: 0.9375rem;
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
          color: var(--primary);
          font-weight: 500;
          border-left: 2px solid var(--primary);
          padding-left: calc(0.75rem - 2px);
        }
        .nav-icon {
          flex-shrink: 0;
          opacity: 0.8;
        }
        .nav-item.active .nav-icon {
          opacity: 1;
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

        /* ── Mobile ── */
        .mobile-topbar {
          display: none;
        }
        .mobile-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.875rem 1.25rem;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .mobile-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--border);
          }
          .mobile-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--surface);
            border-top: 1px solid var(--border);
            z-index: 40;
          }
          .mobile-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            padding: 0.625rem 0.25rem;
            color: var(--text-tertiary);
            text-decoration: none;
            font-size: 0.625rem;
            transition: color 0.15s;
          }
          .mobile-nav-item.active {
            color: var(--primary);
          }
          .mobile-nav-item:hover {
            color: var(--text-primary);
          }
        }
      `}</style>
    </>
  )
}