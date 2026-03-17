#!/usr/bin/env node
const fs = require('node:fs')

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

function assertContains(content, marker, context) {
  if (!content.includes(marker)) {
    throw new Error(`Missing marker "${marker}" in ${context}`)
  }
}

const root = '/home/jonatas/code/pulse'

const soundgardenTrackMap = read(
  `${root}/domain/streaming/soundgarden/src/soundgarden/domain/events/track-event.map.ts`
)
const petrifiedTrackMap = read(
  `${root}/domain/ai/shinod-ai/src/modules/petrified/domain/events/petrified-event.map.ts`
)
const petrifiedOutMap = read(
  `${root}/domain/ai/shinod-ai/src/modules/petrified/domain/events/petrified-event.map.ts`
)
const fortMinorInMap = read(
  `${root}/domain/ai/shinod-ai/src/modules/fort-minor/domain/events/fort-minor-event.map.ts`
)
const stereoInMap = read(
  `${root}/domain/ai/shinod-ai/src/modules/stereo/domain/events/stereo-event.map.ts`
)
const stereoOutMap = read(
  `${root}/domain/ai/shinod-ai/src/modules/stereo/domain/events/stereo-event.map.ts`
)
const mockingbirdMap = read(
  `${root}/domain/streaming/mockingbird/src/mockingbird/domain/events/mockingbird-event.map.ts`
)
const hybridStorageMap = read(
  `${root}/domain/streaming/hybrid-storage/src/hybrid-storage/domain/events/hybrid-storage-event.map.ts`
)
const authorityMap = read(
  `${root}/domain/identity/authority/src/authority/domain/events/authority-event.map.ts`
)
const slimShadyMap = read(
  `${root}/domain/identity/slim-shady/src/slim-shady/domain/events/slim-shady-event.map.ts`
)

// Soundgarden -> Petrified contract parity
assertContains(soundgardenTrackMap, "'track.uploaded':", 'soundgarden track-event.map.ts')
assertContains(petrifiedTrackMap, "'track.uploaded':", 'petrified event.map.ts')
assertContains(soundgardenTrackMap, 'sourceStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'sourceStorage:', 'petrified inbound track.uploaded contract')
assertContains(soundgardenTrackMap, 'petrifiedStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'petrifiedStorage:', 'petrified inbound track.uploaded contract')
assertContains(soundgardenTrackMap, 'fortMinorStorage:', 'soundgarden track.uploaded contract')
assertContains(petrifiedTrackMap, 'fortMinorStorage:', 'petrified inbound track.uploaded contract')

// Petrified -> Fort Minor/Stereo contract parity
assertContains(petrifiedOutMap, "'track.petrified.generated':", 'petrified outbound map')
assertContains(fortMinorInMap, "'track.petrified.generated':", 'fort-minor inbound map')
assertContains(stereoInMap, "'track.petrified.generated':", 'stereo inbound map')
assertContains(petrifiedOutMap, 'storage: { bucket: string; key: string }', 'petrified output')
assertContains(fortMinorInMap, 'storage: { bucket: string; key: string }', 'fort-minor input')
assertContains(stereoInMap, 'storage: { bucket: string; key: string }', 'stereo input')

// Stereo -> Mockingbird approval contract parity
assertContains(stereoOutMap, "'track.approved':", 'stereo outbound map')
assertContains(mockingbirdMap, "'track.approved':", 'mockingbird inbound map')
assertContains(stereoOutMap, 'sourceStorage:', 'stereo approved payload')
assertContains(mockingbirdMap, 'sourceStorage:', 'mockingbird approved payload')
assertContains(stereoOutMap, 'objectKey: string', 'stereo approved payload')
assertContains(mockingbirdMap, 'objectKey: string', 'mockingbird approved payload')

// Mockingbird -> Hybrid Storage HLS contract parity
assertContains(mockingbirdMap, "'track.hls.generated':", 'mockingbird outbound map')
assertContains(hybridStorageMap, "'track.hls.generated':", 'hybrid-storage inbound map')
assertContains(mockingbirdMap, 'masterPlaylist: string', 'mockingbird hls contract')
assertContains(hybridStorageMap, 'masterPlaylist: string', 'hybrid-storage hls contract')

// Authority -> Slim Shady identity contract parity
assertContains(authorityMap, "'authority.user.signed_up':", 'authority outbound map')
assertContains(slimShadyMap, "'authority.user.signed_up':", 'slim-shady inbound map')
assertContains(authorityMap, "'user.profile.created':", 'authority event map')
assertContains(slimShadyMap, "'user.profile.created':", 'slim-shady event map')

console.log('OK event-contracts.check.js')
