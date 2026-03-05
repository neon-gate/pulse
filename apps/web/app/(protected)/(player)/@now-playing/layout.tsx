interface NowPlayingLayoutProps {
  ['song-info']?: React.ReactNode
  streaming?: React.ReactNode
  controller?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['song-info']: songInfo, streaming, controller } = props

  return (
    <div className="now-playing-layout">
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{songInfo}</div>
      <div className="w-[70%] sm:w-[40%] min-w-[330px] max-w-[700px]">
        {streaming}
      </div>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{controller}</div>
    </div>
  )
}
