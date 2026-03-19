## Constraints

- **NEVER modify `@pack/kernel`** -- use its abstractions, don't change them
- **No shared infra between micros** -- each micro owns its own Mongo/Redis/MinIO
- **NATS stays shared** -- single event plane for the entire platform
- **Don't break `pnpm infra`** -- docker scripts must work end-to-end after refactoring
- **Follow GENERAL_CODE_GUIDELINE.md and BACKEND_CODE_GUIDELINE.md** throughout
- **Domain service migration is a separate task** -- this plan covers package/infra/orchestration only
- **Each phase must leave the workspace in a buildable state** -- no intermediate breakage


## Phase 6 -- Cleanup

### 6.1 Delete `repos/environment/` Workspace

After all content has been migrated to the new packages, remove the entire directory:
```
repos/environment/          <-- DELETE ENTIRELY
├── .env.template
├── docker-compose.yml
├── core/
├── lib/
└── events/
```

### 6.2 Update `pnpm-workspace.yaml`

Remove the `"repos/environment/**"` entry:

```yaml
packages:
  - "repos/apps/*"
  - "repos/packages/*"
  - "repos/domain/**"
  - "repos/agents/*"
ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

### 6.3 Update Docker Shell Scripts

All three scripts under `bin/docker/` must be updated:

**`bin/docker/docker-up.sh`** changes:

```bash
# Update compose file path
COMPOSE_FILE="$ROOT_DIR/repos/packages/env-orchestration/docker-compose.yml"

# Update infra services list
INFRA_SERVICES=(
  nats
  authority-mongo
  slim-shady-mongo
  backstage-mongo
  stereo-mongo
  petrified-redis
  fort-minor-redis
  soundgarden-minio
  soundgarden-minio-init
  petrified-minio
  petrified-minio-init
  fort-minor-minio
  fort-minor-minio-init
  mockingbird-minio
  mockingbird-minio-init
  hybrid-storage-minio
  hybrid-storage-minio-init
)

# Update app services list
APP_SERVICES=(
  authority
  slim-shady
  soundgarden
  backstage
  petrified
  fort-minor
  stereo
  mockingbird
  hybrid-storage
  pulse
  shinoda
)

# Update env files list
APP_ENV_FILES=(
  "$ROOT_DIR/repos/domain/identity/authority/.env"
  "$ROOT_DIR/repos/domain/identity/slim-shady/.env"
  "$ROOT_DIR/repos/domain/streaming/soundgarden/.env"
  "$ROOT_DIR/repos/domain/realtime/backstage/.env"
  "$ROOT_DIR/repos/domain/ai/petrified/.env"
  "$ROOT_DIR/repos/domain/ai/fort-minor/.env"
  "$ROOT_DIR/repos/domain/ai/stereo/.env"
  "$ROOT_DIR/repos/domain/streaming/mockingbird/.env"
  "$ROOT_DIR/repos/domain/streaming/hybrid-storage/.env"
  "$ROOT_DIR/repos/apps/pulse/.env"
  "$ROOT_DIR/repos/agents/shinoda/.env"
)

# Update conflict names
CONFLICT_NAMES=(
  nats
  authority-mongo slim-shady-mongo backstage-mongo stereo-mongo
  petrified-redis fort-minor-redis
  soundgarden-minio soundgarden-minio-init
  petrified-minio petrified-minio-init
  fort-minor-minio fort-minor-minio-init
  mockingbird-minio mockingbird-minio-init
  hybrid-storage-minio hybrid-storage-minio-init
  authority slim-shady soundgarden backstage
  petrified fort-minor stereo
  mockingbird hybrid-storage
  pulse shinoda
)
```

**`bin/docker/docker-down.sh`** and **`bin/docker/docker-ps.sh`** -- same `COMPOSE_FILE`, `INFRA_SERVICES`, `APP_SERVICES` updates.

### 6.4 Update `turbo.json`

No special changes needed. The existing default `build` task handles `@pack/environment` and `@pack/event-inventory` via the `"dependsOn": ["^build"]` cascade. `@pack/env-orchestration` has no build script, so Turbo skips it automatically.
