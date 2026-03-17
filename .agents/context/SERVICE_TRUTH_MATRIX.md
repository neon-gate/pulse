# Pulse Service Truth Matrix

## Scope

Current implementation truth captured from:

- `docker-compose.yml`
- `domain/*` services

This is a planning artifact only (no runtime execution performed on this laptop).

---

## Runtime Topology (Compose)

## Infrastructure

- `mongo` (authority/backstage/shared identity-realtime db host)
- `mongo-shinod-ai` (dedicated ai mongo host)
- `redis-shinoda` (ai operational cache/state)
- `nats` (event plane with JetStream enabled)
- `minio` + `minio-init` (object storage and bucket bootstrap)

## Application Services

- `authority` (`7000`)
- `slim-shady` (`7400`)
- `soundgarden` (`7100`)
- `shinod-ai` (`7200`)
- `mockingbird` (`7201 -> container 7200`)
- `hybrid-storage` (`7300`)
- `backstage` (`4001`)
- `pulse` (`3000`)

---

## Service Matrix

| Service | Transport | Persistence | Emits | Consumes |
| --- | --- | --- | --- | --- |
| Authority | HTTP + NATS | Mongo (`mongo`) | `authority.user.*`, `authority.token.refreshed` | `user.profile.created` |
| Slim Shady | HTTP + NATS | Mongo (`mongo`) | `user.profile.*` | `authority.user.signed_up` |
| Soundgarden | HTTP + NATS | local `/tmp/uploads` + MinIO | `track.upload.*`, `track.uploaded`, `track.upload.failed` | none |
| Shinod AI (monolithic deployable) | HTTP health + NATS | Mongo (`mongo-shinod-ai`), Redis, MinIO refs | `track.petrified.*`, `track.duplicate.detected`, `track.fort-minor.*`, `track.stereo.*`, `track.approved/rejected` | `track.uploaded`, `track.petrified.generated`, `track.fort-minor.completed` |
| Mockingbird | HTTP health + NATS | `/tmp/hls` + MinIO | `track.transcoding.*`, `track.hls.generated` | `track.approved` |
| Hybrid Storage | HTTP health + NATS | `/tmp/hls` + MinIO | `track.hls.stored` | `track.hls.generated` |
| Backstage | HTTP + Socket.IO + NATS | Mongo (`mongo`) | websocket `pipeline.event` | `track.>` |
| Pulse (Next.js/BFF) | HTTP + Socket.IO client | Browser/Jotai | none | HTTP APIs + websocket stream |

---

## Boundary/Dependency Notes

- Identity boundary is mostly clean: Authority owns auth, Slim Shady owns profile.
- Shinod AI currently shares infra internally across modules; split target is independent microservices.
- Mockingbird and Hybrid Storage both mount `/tmp/hls`; this is a local compose convenience, not a domain ownership model.
- Backstage uses wildcard event consumption and must stay projection-only.

---

## Detected Contract Risks

1. Shinod AI is still one deployable service despite stage-level contract separation.
2. Storage naming drift (`tracks` vs `uploads`) still requires cleanup across env/config surfaces.
3. Backstage mock subjects must stay clearly isolated from runtime subjects as the pipeline evolves.
