export interface StoredPlaylist {
  data: Buffer
  contentType: string
}

export interface StoredSegment {
  data: Buffer
  contentType: string
}

export abstract class SegmentStorePort {
  abstract playlistExists(trackId: string): Promise<boolean>
  abstract getPlaylist(trackId: string): Promise<StoredPlaylist>
  abstract getSegment(trackId: string, segment: string): Promise<StoredSegment>
  abstract ensureOutputDir(trackId: string): Promise<string>
  abstract getInputFile(trackId: string): Promise<string>
}
