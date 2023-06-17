import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext'
import './globals.css'
import { Inter } from 'next/font/google'

import ActiveStatus from './components/ActiveStatus.tsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '1948 Chat App',
  description: 'A chat app for 1948. Developed by 1948 team & Tunahan Doğan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
