import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NLP Scripts Viewer',
  description: 'Search and view PDF scripts with voice or text input',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
