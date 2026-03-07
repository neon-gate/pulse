import { metadataAtom } from '@lib/atoms'
import { useAtomValue } from 'jotai'
import Image from 'next/image'

export function TrackMetadata() {
  const metadata = useAtomValue(metadataAtom)

  // TODO: check Suspense
  if (!metadata) return null

  return (
    <div className="flex gap-1 items-center">
      <Image
        src={metadata.album.cover}
        alt={metadata.album.name}
        width={20}
        height={20}
      />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{metadata.title}</span>
        <span className="text-sm text-muted-foreground">{metadata.artist}</span>
      </div>
    </div>
  )
}
