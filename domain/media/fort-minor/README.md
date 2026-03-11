# 📥 Upload Service

The Upload service handles **ingestion of new media assets** into the platform.

It is responsible for receiving audio files and initiating the media processing pipeline.

---

# Responsibilities

- accepting audio uploads
- validating files
- storing initial media assets
- triggering the transcoding pipeline

---

# Upload Flow
Artist Upload
↓
Upload Service
↓
Backstage Storage
↓
Transcoder

Once processing is complete, the track becomes available to the **Media catalog and Streaming services**.

---

# Design Goals

- reliable ingestion pipeline
- secure file uploads
- integration with media processing services