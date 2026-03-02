import { DirectionProvider } from '@base-ui/react/direction-provider'
import { Geo, Iceland } from 'next/font/google'

import './globals.css'

const geo = Geo({
  subsets: ['latin'],
  weight: '400'
})

const iceland = Iceland({
  subsets: ['latin'],
  weight: '400'
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props

  return (
    <html lang="en">
      <body
        className={`${geo.className} ${iceland.className} min-h-screen bg-background`}
      >
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  )
}
