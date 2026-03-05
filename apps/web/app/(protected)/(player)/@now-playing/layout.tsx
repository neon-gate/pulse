interface NowPlayingLayoutProps {
  ['song-info']?: React.ReactNode
  streaming?: React.ReactNode
  controller?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['song-info']: songInfo, streaming, controller } = props

  return (
    <div className="now-playing-layout">
      <div className="w-[25%] min-w-[180px]">{songInfo}</div>
      <div className="w-[50%] max-w-[700px]">{streaming}</div>
      <div className="w-[25%]">{controller}</div>
    </div>
  )
}
