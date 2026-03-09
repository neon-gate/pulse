# 📚 Metadata Service

The Metadata service manages the **catalog of media information**.

It stores and serves structured information about tracks without handling the actual audio files.

---

# Responsibilities

The service manages:

- track titles
- artists
- albums
- duration
- cover art references
- catalog indexing

---

# Example Data

Metadata describes a track:
Track
```
├─ title
├─ artist
├─ album
├─ duration
└─ artwork
```

---

# Role in Architecture
```
Metadata Service
↓
Streaming Service
↓
Client Player
```
The streaming layer uses metadata to **present playable media to users**.

