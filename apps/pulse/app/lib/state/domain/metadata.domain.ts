export interface Metadata {
  title: string
  artist: string
  album: {
    name: string
    cover: string
  }
  duration: number // in seconds
}
