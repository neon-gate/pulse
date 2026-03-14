/// Storage reference returned after a successful upload.
export interface StorageRef {
  bucket: string
  key: string
}

export interface UploadedStorageRefs {
  soundgarden?: StorageRef
  fingerprint?: StorageRef
  transcription?: StorageRef
}

/// Port for uploading audio files to object storage.
export abstract class ObjectStoragePort {
  abstract upload(
    trackId: string,
    fileName: string,
    soundgardenBucket: string,
    buffer: Buffer,
    contentType: string
  ): Promise<UploadedStorageRefs>
}
