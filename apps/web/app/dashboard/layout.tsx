'use client'

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { ToastProvider } from '@/components/ui/Toast'

const SIDEBAR_WIDTH = 280

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--background)'
      }}>
        <DashboardSidebar user={null} />
        <main style={{
          flex: 1,
          overflow: 'auto',
          marginLeft: `${SIDEBAR_WIDTH}px`,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}