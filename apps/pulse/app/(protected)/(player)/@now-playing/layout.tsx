import { NowPlayingLayout as Layout } from './lib/ui'
interface NowPlayingLayoutProps {
  ['track-metadata']?: React.ReactNode
  streaming?: React.ReactNode
  ['volume-bar']?: React.ReactNode
}

export default function NowPlayingLayout(props: NowPlayingLayoutProps) {
  const { ['track-metadata']: trackMetadata, streaming, ['volume-bar']: volumeBar } = props

  return (
    <Layout>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{trackMetadata}</div>
      <div className="w-[70%] sm:w-[40%] min-w-[330px] max-w-[700px]">
        {streaming}
      </div>
      <div className="w-[15%] sm:w-[30%] mobile-hidden">{volumeBar}</div>
    </Layout>
  )
}
