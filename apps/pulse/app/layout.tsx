import { Provider as JotaiProvider } from 'jotai'

import { cn } from '@lib/template'

import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props

  return (
    <html lang="en">
      <body className={cn('font-sans')}>
        <JotaiProvider>{children}</JotaiProvider>
      </body>
    </html>
  )
}
