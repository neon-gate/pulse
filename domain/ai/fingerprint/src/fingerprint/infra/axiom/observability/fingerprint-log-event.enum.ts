export enum FingerprintLogEvent {
  FingerprintStarted = 'FINGERPRINT_STARTED',
  FingerprintCompleted = 'FINGERPRINT_COMPLETED',
  FingerprintFailed = 'FINGERPRINT_FAILED',
  DuplicateDetected = 'DUPLICATE_DETECTED',
  EventPublishFailed = 'EVENT_PUBLISH_FAILED',
  ServiceStartupFailed = 'SERVICE_STARTUP_FAILED'
}
