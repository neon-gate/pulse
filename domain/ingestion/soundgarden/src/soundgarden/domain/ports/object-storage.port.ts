/// Storage reference returned after a successful upload.
export interface StorageRef {
  bucket: string
  key: string
}

/// Port for uploading audio files to object storage.
export abstract class ObjectStoragePort {
  abstract upload(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<StorageRef>
}
