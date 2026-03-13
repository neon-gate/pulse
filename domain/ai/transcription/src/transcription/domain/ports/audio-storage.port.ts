export interface DownloadedAudio {
  filePath: string
  cleanup: () => Promise<void>
}

export abstract class AudioStoragePort {
  abstract download(bucket: string, key: string): Promise<DownloadedAudio>
}
