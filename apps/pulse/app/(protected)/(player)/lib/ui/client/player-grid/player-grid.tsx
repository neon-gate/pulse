import { cn } from "@lib/template"

interface PlayerGridProps {
  children: React.ReactNode
}

export function PlayerGrid(props: PlayerGridProps) {
  const {children} = props

  const layout = "grid grid-rows-[auto_1fr_auto] sm:grid-cols-[240px_1fr_300px]"
  const spacing = "h-screen overflow-hidden gap-2"
  const mobile = "grid-cols-[1fr_1fr_1fr]"

  return (
    <div className={cn(layout, spacing, mobile)}>
      {children}
    </div>
  )
}