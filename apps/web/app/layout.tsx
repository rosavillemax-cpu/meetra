import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Callroom — Schedule meetings effortlessly',
  description: 'Share your Callroom link. Guests pick a time. It shows up in your calendar — no emails, no confusion.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'Callroom',
    title: 'Callroom — Schedule meetings effortlessly',
    description: 'Share your Callroom link. Guests pick a time. It shows up in your calendar — no emails, no confusion.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Callroom — Schedule meetings effortlessly',
    description: 'Share your Callroom link. Guests pick a time. It shows up in your calendar — no emails, no confusion.',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}