import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RUX - Travel Booking App',
  description: 'Plan your next adventure with RUX - a modern travel booking platform',
  keywords: ['Travel', 'Booking', 'Adventure', 'RUX', 'Next.js'],
  authors: [{ name: 'RUX Travel' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 