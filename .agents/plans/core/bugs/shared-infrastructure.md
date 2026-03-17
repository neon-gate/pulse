# Bug: Shared infrastructure between services

## Summary

The repo uses a shared `infrastructure/` directory (e.g. `infrastructure/minio/`) that is referenced by Docker and DX scripts. Per project rules, microservices should not share infrastructure.

## Current behavior

- [bin/docker/docker-up.sh](bin/docker/docker-up.sh) requires `infrastructure/minio/.env` and lists it in `INFRA_ENV_FILES`.
- [docker-compose.yml](docker-compose.yml) uses `infrastructure/minio/.env` for the `minio` and `minio-init` services.
- [bin/dx/tooling/env-template.sh](bin/dx/tooling/env-template.sh) copies `.env.template` to `.env` under `infrastructure/` when present.

This creates a single, shared infra config (MinIO env) used by multiple services instead of each consumer owning or explicitly depending on its own config.

## Desired behavior

- No shared `infrastructure/` layer; each microservice (or each logical consumer) should own or explicitly depend on its own infra configuration.
- Docker and DX scripts should not rely on a global `infrastructure/minio/.env`; MinIO-related env could live per-service or in a dedicated, non-shared setup.

## References

- Backend rule: no shared infrastructure between microservices (see [.agents/rules/BACKEND_CODE_GUIDELINE.md](.agents/rules/BACKEND_CODE_GUIDELINE.md)).
- Affected: `docker-compose.yml`, `bin/docker/docker-up.sh`, `bin/dx/tooling/env-template.sh`, `infrastructure/minio/`.

## Status

Deferred. To be solved later.
