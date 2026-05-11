'use client'

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { ToastProvider } from '@/components/ui/Toast'

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
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}