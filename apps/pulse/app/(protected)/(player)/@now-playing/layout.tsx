import { NowPlayingLayout as Layout } from './lib/ui'
interface NowPlayingLayoutProps {
  ['track-metadata']?: React.ReactNode
  playback?: React.ReactNode
  ['volume-bar']?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['track-metadata']: trackMetadata, playback, ['volume-bar']: volumeBar } = props

  return (
    <Layout>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{trackMetadata}</div>
      <div className="w-[70%] sm:w-[40%] min-w-[300px] max-w-[700px]">
        {playback}
      </div>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{volumeBar}</div>
    </Layout>
  )
}
