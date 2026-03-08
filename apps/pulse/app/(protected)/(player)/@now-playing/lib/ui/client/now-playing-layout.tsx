import { cn } from "@lib/template"

interface NowPlayingLayoutProps {
  children: React.ReactNode
}

export function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const {children} = props

  const layout = "w-full sm:w-auto flex flex-row justify-center sm:justify-between items-center col-span-3 "
  const bar = "p-2 sticky bottom-0 h-[88px] border-none text-background font-bold place-content-center glassy-surface"

  return (
    <aside className={cn(layout, bar)}>
      {children}
    </aside>
  )
}