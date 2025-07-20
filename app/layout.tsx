import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '../components/ui/toaster'

export const metadata: Metadata = {
  title: 'Jabones',
  description: 'Created with jabon',
  generator: 'jabon.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
