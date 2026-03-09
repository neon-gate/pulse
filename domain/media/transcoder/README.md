# 🔁 Transcoder Service

The Transcoder service converts uploaded audio files into **streamable formats**.

It prepares media so it can be delivered efficiently to client players.

---

# Responsibilities

The service performs:

- audio format conversion
- bitrate optimization
- generation of streaming assets
- preparation of HLS-compatible files

---

# Media Pipeline Role
Upload
↓
Transcoder
↓
Storage
↓
Streaming


The transcoder ensures that all audio files are **optimized for playback**.

---

# Design Goals

- consistent audio formats
- efficient streaming delivery
- scalable processing