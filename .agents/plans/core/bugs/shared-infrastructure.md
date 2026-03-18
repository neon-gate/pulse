# Bug: Shared infrastructure between services

## Summary

The repo uses a shared `infrastructure/` directory (e.g. `environment/storage/minio/`) that is referenced by Docker and DX scripts. Per project rules, microservices should not share infrastructure.

## Current behavior

- [bin/docker/docker-up.sh](bin/docker/docker-up.sh) requires `environment/storage/minio/.env` and lists it in `INFRA_ENV_FILES`.
- [docker-compose.yml](docker-compose.yml) uses `environment/storage/minio/.env` for the `minio` and `minio-init` services.
- [bin/dx/tooling/env-template.sh](bin/dx/tooling/env-template.sh) copies `.env.template` to `.env` under `infrastructure/` when present.

This creates a single, shared infra config (MinIO env) used by multiple services instead of each consumer owning or explicitly depending on its own config.

## Desired behavior

- No shared `infrastructure/` layer; each microservice (or each logical consumer) should own or explicitly depend on its own infra configuration.
- Docker and DX scripts should not rely on a global `environment/storage/minio/.env`; MinIO-related env could live per-service or in a dedicated, non-shared setup.

## References

- Backend rule: no shared infrastructure between microservices (see [.agents/rules/BACKEND_CODE_GUIDELINE.md](.agents/rules/BACKEND_CODE_GUIDELINE.md)).
- Affected: `docker-compose.yml`, `bin/docker/docker-up.sh`, `bin/dx/tooling/env-template.sh`, `environment/storage/minio/`.

## Status

Resolved in current phase:

- `docker-compose.yml` no longer uses `environment/storage/minio/.env` for `minio` and `minio-init`.
- `bin/docker/docker-up.sh` no longer requires `environment/storage/minio/.env`.
- `bin/dx/tooling/env-template.sh` no longer scans `infrastructure/` for `.env.template`.
