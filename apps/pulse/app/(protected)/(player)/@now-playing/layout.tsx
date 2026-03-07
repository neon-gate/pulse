import './lib/css/now-playing.component.css'

interface NowPlayingLayoutProps {
  ['track-metadata']?: React.ReactNode
  streaming?: React.ReactNode
  volume?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['track-metadata']: trackMetadata, streaming, volume } = props

  return (
    <aside className="col-span-3 now-playing-bar glassy-surface now-playing-layout">
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{trackMetadata}</div>
      <div className="w-[70%] sm:w-[40%] min-w-[330px] max-w-[700px]">
        {streaming}
      </div>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{volume}</div>
    </aside>
  )
}
