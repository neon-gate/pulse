export interface FingerprintResult {
  fingerprintHash: string
  audioHash: string
}

/// Port for computing an acoustic fingerprint from a local audio file.
export abstract class FingerprintGeneratorPort {
  abstract generate(filePath: string): Promise<FingerprintResult>
}
