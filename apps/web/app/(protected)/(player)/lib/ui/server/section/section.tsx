interface PlayerSectionProps {
  children: React.ReactNode
}

export function PlayerSection(props: PlayerSectionProps) {
  const { children } = props

  return <aside className="player-section">{children}</aside>
}
