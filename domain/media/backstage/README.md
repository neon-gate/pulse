# 🗄 Backstage Storage — Media Asset Storage Service

Backstage Storage is responsible for the **persistent storage of media assets** within the Media bounded context.

It manages the storage layer where audio files are kept after they are uploaded to the platform. These files are stored in **object storage (S3)** and later consumed by other services in the media pipeline.

This service acts as the **durable storage backbone** for all media assets.

---

# Responsibilities

Backstage Storage is responsible for:

* storing uploaded audio files
* organizing object storage paths
* managing references to stored media
* exposing storage access for internal media services

The service ensures that uploaded files are **reliably persisted and accessible** to the rest of the platform.

---

# Storage Infrastructure

Media assets are stored in **S3-compatible object storage**.

Object storage is used because it provides:

* highly durable storage
* scalable file management
* efficient large file handling
* integration with distributed systems

Typical stored assets include:

* raw uploaded audio
* intermediate processing files
* transcoded audio outputs

---

# Role in the Media Pipeline

Backstage Storage sits at the center of the **media ingestion and processing pipeline**.

```
Upload Service
      ↓
Backstage Storage (S3)
      ↓
Transcoder
      ↓
Metadata
      ↓
Streaming
```

1. The **Upload service** receives media files.
2. Files are stored in **Backstage Storage (S3)**.
3. The **Transcoder** retrieves the stored files for processing.
4. Processed assets become available to the streaming layer.

---

# Storage Model

Each stored asset is typically referenced by a **media identifier** and a **storage path**.

Example structure:

```
media/
  uploads/
    {trackId}/
      original.wav

  transcoded/
    {trackId}/
      master.m3u8
      segment_001.ts
```

This structure enables predictable asset lookup and scalable storage organization.

---

# Design Goals

Backstage Storage is designed to provide:

* durable media persistence
* scalable object storage
* predictable asset organization
* reliable integration with processing services

The storage layer remains intentionally simple and focused on **media persistence**, leaving processing responsibilities to other services such as the Transcoder.

---

# Context in the Media Domain

Within the Media bounded context, Backstage Storage is responsible for **managing the physical storage of media assets**, while other services handle the logical aspects of the media catalog.

```
Tracks → domain representation of media
Metadata → descriptive information
Backstage Storage → physical asset storage
Transcoder → media processing
Upload → ingestion pipeline
```

Together, these services form the **complete media lifecycle system** that powers the platform's audio infrastructure.
