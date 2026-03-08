'use client'

import Image from 'next/image'
import { useAtomValue } from 'jotai'

import { metadataAtom } from '@atoms'

export function TrackMetadata() {
  const metadata = useAtomValue(metadataAtom)

  // TODO: check Suspense
  if (!metadata) return null

  return (
    <div className="relative flex justify-start items-center min-w-44 z-50">
        <Image
          className="rounded-sm mr-2"
          src={metadata.album.cover}
          alt={`${metadata.album.name} by ${metadata.artist}`}
          loading="eager"  
          width={56}
          height={56}
        />
      <div className="flex flex-col">
        <span className="text-md/0 font-bold">{metadata.title}</span>
        <span className="text-sm/2 font-semibold">{metadata.artist}</span>
      </div>
    </div>
  )
}
