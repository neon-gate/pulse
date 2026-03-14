# FEATURE PLAN

## Mockingbird Transcoding Microservice

---

# ROLE

You are a **senior distributed systems engineer** designing the **transcoding microservice** within the Pulse music streaming platform.

Follow the architectural conventions used by existing services:

* `domain/identity/authority`
* `domain/ingestion/soundgarden`

Architecture style:

```
Clean Architecture
Ports and Adapters
Event-driven microservices
```

Framework:

```
NestJS
Node.js
```

Messaging:

```
NATS
```

Object storage:

```
MinIO
```

Audio transcoding:

```
FFmpeg
```

---

# PURPOSE

Mockingbird converts uploaded audio tracks into streaming-ready formats.

Responsibilities:

```
1. Listen for approved tracks
2. Download original audio
3. Transcode into streaming variants
4. Upload transcoded files
5. Emit pipeline events
```

Mockingbird **does NOT**:

```
analyze audio
perform AI reasoning
serve playback
store metadata
```

Those belong to other services.

---

# PIPELINE CONTEXT

```
Client
  │
  ▼
Soundgarden (upload)
  │
  ▼
track.uploaded
  │
  ▼
Sempiternal (AI cognition)
  │
  ▼
track.approved
  │
  ▼
Mockingbird (transcoding)
  │
  ▼
track.transcoding.completed
  │
  ▼
Fort-Minor (delivery)
```

---

# EVENTS CONSUMED

Mockingbird subscribes to:

```
track.approved
```

Example payload:

```json
{
  "trackId": "uuid",
  "objectKey": "uploads/{trackId}/original.mp3"
}
```

---

# EVENTS EMITTED

```
track.transcoding.started
track.transcoding.completed
track.transcoding.failed
```

Example completion event:

```json
{
  "trackId": "uuid",
  "variants": [
    "transcoded/{trackId}/128.mp3",
    "transcoded/{trackId}/320.mp3"
  ]
}
```

---

# TRANSCODING TARGETS

Generate:

```
128kbps MP3
320kbps MP3
```

Paths:

```
transcoded/{trackId}/128.mp3
transcoded/{trackId}/320.mp3
```

---

# STORAGE STRATEGY

Object storage uses MinIO.

Buckets:

```
uploads
transcoded
```

Example layout:

```
uploads/{trackId}/original.mp3
transcoded/{trackId}/128.mp3
transcoded/{trackId}/320.mp3
```

---

# PROJECT STRUCTURE

```
mockingbird/

src/

domain/
  entities/
    transcoding-job.entity.ts

application/
  use-cases/
    transcode-track.use-case.ts

  ports/
    storage.port.ts
    transcoder.port.ts
    event-bus.port.ts

infrastructure/

  storage/
    minio-storage.adapter.ts

  transcoder/
    ffmpeg-transcoder.adapter.ts

  messaging/
    nats-event-bus.adapter.ts

interface/
  consumers/
    track-approved.consumer.ts

mockingbird.module.ts
main.ts
```

---

# DOMAIN

### transcoding-job.entity.ts

```ts
export class TranscodingJob {
  constructor(
    public readonly trackId: string,
    public readonly sourceKey: string
  ) {}
}
```

---

# APPLICATION PORTS

### storage.port.ts

```ts
export interface StoragePort {
  download(objectKey: string): Promise<string>
  upload(objectKey: string, filePath: string): Promise<void>
}
```

---

### transcoder.port.ts

```ts
export interface TranscoderPort {
  transcode(inputFile: string, bitrate: number): Promise<string>
}
```

---

### event-bus.port.ts

```ts
export interface EventBusPort {
  publish(subject: string, payload: any): Promise<void>
}
```

---

# USE CASE

### transcode-track.use-case.ts

```ts
import { StoragePort } from "../ports/storage.port"
import { TranscoderPort } from "../ports/transcoder.port"
import { EventBusPort } from "../ports/event-bus.port"

export class TranscodeTrackUseCase {

  constructor(
    private readonly storage: StoragePort,
    private readonly transcoder: TranscoderPort,
    private readonly eventBus: EventBusPort
  ) {}

  async execute(trackId: string, objectKey: string) {

    await this.eventBus.publish("track.transcoding.started", { trackId })

    const original = await this.storage.download(objectKey)

    const file128 = await this.transcoder.transcode(original, 128)
    const file320 = await this.transcoder.transcode(original, 320)

    const key128 = `transcoded/${trackId}/128.mp3`
    const key320 = `transcoded/${trackId}/320.mp3`

    await this.storage.upload(key128, file128)
    await this.storage.upload(key320, file320)

    await this.eventBus.publish("track.transcoding.completed", {
      trackId,
      variants: [key128, key320]
    })
  }
}
```

---

# STORAGE ADAPTER

### minio-storage.adapter.ts

```ts
import { Client } from "minio"
import { StoragePort } from "../../application/ports/storage.port"
import * as fs from "fs"

export class MinioStorageAdapter implements StoragePort {

  constructor(private readonly client: Client) {}

  async download(objectKey: string): Promise<string> {

    const path = `/tmp/${Date.now()}.mp3`
    const stream = await this.client.getObject("uploads", objectKey)

    const file = fs.createWriteStream(path)
    stream.pipe(file)

    return new Promise((resolve) => {
      file.on("finish", () => resolve(path))
    })
  }

  async upload(objectKey: string, filePath: string) {

    await this.client.fPutObject(
      "transcoded",
      objectKey,
      filePath
    )
  }
}
```

---

# TRANSCODER ADAPTER

### ffmpeg-transcoder.adapter.ts

```ts
import { exec } from "child_process"
import { promisify } from "util"
import { TranscoderPort } from "../../application/ports/transcoder.port"

const execAsync = promisify(exec)

export class FfmpegTranscoderAdapter implements TranscoderPort {

  async transcode(input: string, bitrate: number): Promise<string> {

    const output = `/tmp/${Date.now()}-${bitrate}.mp3`

    const cmd = `ffmpeg -y -i ${input} -b:a ${bitrate}k ${output}`

    await execAsync(cmd)

    return output
  }
}
```

---

# EVENT CONSUMER

### track-approved.consumer.ts

```ts
import { Controller } from "@nestjs/common"
import { EventPattern, Payload } from "@nestjs/microservices"
import { TranscodeTrackUseCase } from "../../application/use-cases/transcode-track.use-case"

@Controller()
export class TrackApprovedConsumer {

  constructor(
    private readonly useCase: TranscodeTrackUseCase
  ) {}

  @EventPattern("track.approved")
  async handle(@Payload() payload: any) {

    await this.useCase.execute(
      payload.trackId,
      payload.objectKey
    )
  }
}
```

---

# MODULE

### mockingbird.module.ts

```ts
import { Module } from "@nestjs/common"

@Module({
  providers: [],
})
export class MockingbirdModule {}
```

---

# MAIN

### main.ts

```ts
import { NestFactory } from "@nestjs/core"
import { MockingbirdModule } from "./mockingbird.module"

async function bootstrap() {

  const app = await NestFactory.createMicroservice(
    MockingbirdModule,
    {
      transport: 1
    }
  )

  await app.listen()
}

bootstrap()
```

---

# DOCKERFILE

```
FROM node:20

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["node", "dist/main.js"]
```

---

# EXPECTED BEHAVIOR

Flow:

```
track.approved
   │
   ▼
Mockingbird
   │
download original
   │
transcode 128 + 320
   │
upload files
   │
emit track.transcoding.completed
```
