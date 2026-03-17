import { Inject, Injectable } from '@nestjs/common'
import { uuidv7 } from 'uuidv7'
import { UseCase } from '@repo/kernel'

import {
  FileStoragePort,
  FileValidatorPort,
  ObjectStoragePort,
  TrackEventBusPort
} from '@domain/ports'
import type {
  StoredFileInfo,
  UploadedStorageRefs,
  ValidationFailure
} from '@domain/ports'

import {
  UPLOAD_MAX_SIZE_BYTES,
  UPLOAD_STORAGE_BUCKET,
  UPLOAD_STORAGE_PATH
} from '@infra/upload-config.provider'

export interface UploadTrackInput {
  file: Express.Multer.File
}

export interface UploadTrackResult {
  trackId: string
  status: 'uploaded'
}

@Injectable()
export class UploadTrackUseCase extends UseCase<
  [input: UploadTrackInput],
  UploadTrackResult
> {
  constructor(
    @Inject(TrackEventBusPort)
    private readonly events: TrackEventBusPort,
    private readonly validator: FileValidatorPort,
    private readonly storage: FileStoragePort,
    private readonly objectStorage: ObjectStoragePort,
    @Inject(UPLOAD_MAX_SIZE_BYTES)
    private readonly maxSizeBytes: number,
    @Inject(UPLOAD_STORAGE_PATH)
    private readonly storagePath: string,
    @Inject(UPLOAD_STORAGE_BUCKET)
    private readonly storageBucket: string
  ) {
    super()
  }

  async execute(input: UploadTrackInput): Promise<UploadTrackResult> {
    const { file } = input
    const trackId = uuidv7()

    void this.events
      .emit('track.upload.received', {
        trackId,
        fileName: file.originalname,
        receivedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    const validation = await this.validator.validate(file, this.maxSizeBytes)

    if (!validation.success) {
      const failure = validation as ValidationFailure
      void this.events
        .emit('track.upload.failed', {
          trackId,
          errorCode: failure.errorCode,
          message: failure.message
        })
        .catch(() => undefined)
      throw new UploadValidationError(failure.errorCode, failure.message)
    }

    void this.events
      .emit('track.upload.validated', {
        trackId,
        fileName: file.originalname,
        fileSize: validation.fileSize,
        mimeType: validation.mimeType,
        validatedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    let stored: StoredFileInfo
    try {
      stored = await this.storage.store(trackId, file, this.storagePath)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Storage operation failed'
      void this.events
        .emit('track.upload.failed', {
          trackId,
          errorCode: 'STORAGE_FAILED',
          message
        })
        .catch(() => undefined)
      throw new UploadStorageError(message)
    }

    void this.events
      .emit('track.upload.stored', {
        trackId,
        filePath: stored.filePath,
        fileName: stored.fileName,
        fileSize: stored.fileSize,
        storedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    // Attempt object storage upload. If MinIO is not configured or
    // unavailable, proceed with local storage only.
    let storageRefs: UploadedStorageRefs = {}
    try {
      storageRefs = await this.objectStorage.upload(
        trackId,
        stored.fileName,
        this.storageBucket,
        file.buffer,
        validation.mimeType
      )
    } catch {
      // Non-fatal: object storage is optional for local bring-up.
    }

    const petrifiedRef = storageRefs.petrified ?? storageRefs.fingerprint
    const fortMinorRef = storageRefs.fortMinor ?? storageRefs.transcription
    const soundgardenRef = storageRefs.soundgarden
    const sourceStorage = fortMinorRef ?? petrifiedRef ?? soundgardenRef

    void this.events
      .emit('track.uploaded', {
        trackId,
        filePath: stored.filePath,
        fileName: stored.fileName,
        fileSize: stored.fileSize,
        mimeType: validation.mimeType,
        ...(soundgardenRef && {
          soundgardenStorage: soundgardenRef
        }),
        ...(sourceStorage && {
          sourceStorage
        }),
        ...(petrifiedRef && {
          petrifiedStorage: petrifiedRef,
          storage: petrifiedRef
        }),
        ...(fortMinorRef && {
          fortMinorStorage: fortMinorRef,
          transcriptionStorage: fortMinorRef
        }),
        uploadedAt: new Date().toISOString()
      })
      .catch(() => undefined)

    return { trackId, status: 'uploaded' }
  }
}

export class UploadValidationError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string
  ) {
    super(message)
    this.name = 'UploadValidationError'
  }
}

export class UploadStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UploadStorageError'
  }
}
