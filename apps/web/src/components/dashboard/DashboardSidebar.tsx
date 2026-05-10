'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, CalendarDays, Clock4, CalendarClock, Settings, X, Menu, type LucideIcon } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [closeMobile])

  return (
    <>
      {/* Backdrop overlay — mobile drawer açıkken görünür */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — tek component, desktop'ta fixed left, mobile'da slide-in */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="brand" onClick={closeMobile}>
            <div className="brand-icon">C</div>
            <span className="brand-name">Callroom</span>
          </Link>
          <button className="sidebar-close" onClick={closeMobile} aria-label="Menüyü kapat">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item ${pathname === href ? 'active' : ''}`}
              onClick={closeMobile}
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

      {/* Mobile top bar — sadece 768px altında görünür */}
      <header className="mobile-topbar">
        <Link href="/" className="brand">
          <div className="brand-icon">C</div>
          <span className="brand-name">Callroom</span>
        </Link>
        <div className="mobile-topbar-right">
          {user?.image && (
            <img src={user.image} alt={user.name || ''} className="mobile-avatar" />
          )}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <style jsx>{`
        /* ── Backdrop overlay ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 49;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Sidebar — desktop: her zaman görünür fixed left ── */
        .sidebar {
          width: 280px;
          min-height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          flex-shrink: 0;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
        }
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .sidebar-close {
          display: none;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .sidebar-close:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
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
          opacity: 0.6;
        }
        .signout-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
          opacity: 1;
        }

        /* ── Mobile top bar ── */
        .mobile-topbar {
          display: none;
        }
        .mobile-topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mobile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border);
        }
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .hamburger-btn:hover {
          background: var(--surface-hover);
        }

        /* ── Desktop: sidebar fixed left, hamburger/overlay/close hidden ── */
        @media (min-width: 769px) {
          .sidebar-overlay {
            display: none !important;
          }
          .sidebar {
            transform: translateX(0) !important;
          }
          .sidebar-close {
            display: none !important;
          }
          .hamburger-btn {
            display: none !important;
          }
        }

        /* ── Mobile: sidebar gizli, drawer olarak slide-in ── */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.25s ease-out;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 32px rgba(0,0,0,0.15);
          }
          .sidebar-header {
            padding: 1rem 1.25rem;
            margin-bottom: 0.5rem;
          }
          .sidebar-close {
            display: flex;
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
          .sidebar-overlay {
            display: block;
          }
        }
      `}</style>
    </>
  )
}
