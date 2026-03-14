/// Download result returned after fetching from object storage.
export interface DownloadedAudio {
  filePath: string
  cleanup: () => Promise<void>
}

/// Port for downloading audio files from object storage to a temp location.
export abstract class AudioStoragePort {
  abstract download(bucket: string, key: string): Promise<DownloadedAudio>
}
