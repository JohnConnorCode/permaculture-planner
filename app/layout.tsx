import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { ScrollToTop } from '@/components/scroll-to-top'
import { ActionFeedback } from '@/components/ui/action-feedback'
import { ErrorBoundary } from '@/components/error-boundary'
import { validateEnv } from '@/lib/env'

// Validate environment variables on startup
if (typeof window === 'undefined') {
  validateEnv()
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Permaculture Planner - Raised Bed Garden Design',
  description: 'AI-powered permaculture planning for raised bed gardens on any surface',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Garden Plan'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <ActionFeedback />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}