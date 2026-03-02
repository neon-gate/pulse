export default function NowPlayingLayout(props: any) {
  const songMetadata = props.songMetadata ?? props['song-metadata'] ?? null
  const streaming = props.streaming ?? null
  const controller = props.controller ?? null

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 124,
        display: 'flex',
        border: '2px solid red',
        background: 'var(--ng-color-card)',
        zIndex: 40
      }}
    >
      <div style={{ width: 320, padding: 8 }}>{songMetadata}</div>
      <div style={{ flex: 1, padding: 8 }}>{streaming}</div>
      <div style={{ width: 320, padding: 8 }}>{controller}</div>
    </div>
  )
}
