import type { Metadata, Viewport } from 'next'
import './globals.css'
import { QueryProvider } from '@/components/query-provider'

export const metadata: Metadata = {
  title: 'Habit MAP',
  description: 'Build your habit with MAP',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}