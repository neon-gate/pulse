export enum SoundgardenLogEvent {
  UploadReceived = 'UPLOAD_RECEIVED',
  UploadValidated = 'UPLOAD_VALIDATED',
  UploadStored = 'UPLOAD_STORED',
  UploadCompleted = 'UPLOAD_COMPLETED',
  UploadFailed = 'UPLOAD_FAILED',
  EventPublishFailed = 'EVENT_PUBLISH_FAILED',
  CleanupCompleted = 'CLEANUP_COMPLETED',
  CleanupFailed = 'CLEANUP_FAILED',
  ServiceStartupFailed = 'SERVICE_STARTUP_FAILED'
}
