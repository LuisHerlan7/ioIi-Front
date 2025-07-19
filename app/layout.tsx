import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
