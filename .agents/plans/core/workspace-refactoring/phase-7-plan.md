## Constraints

- **NEVER modify `@pack/kernel`** -- use its abstractions, don't change them
- **No shared infra between micros** -- each micro owns its own Mongo/Redis/MinIO
- **NATS stays shared** -- single event plane for the entire platform
- **Don't break `pnpm infra`** -- docker scripts must work end-to-end after refactoring
- **Follow GENERAL_CODE_GUIDELINE.md and BACKEND_CODE_GUIDELINE.md** throughout
- **Domain service migration is a separate task** -- this plan covers package/infra/orchestration only
- **Each phase must leave the workspace in a buildable state** -- no intermediate breakage


## Phase 7 -- Documentation

### 7.1 README.md for `@pack/environment`

Contents:
- Purpose: fail-fast environment variable access utilities
- API: `requireStringEnv`, `requireNumberEnv`, `optionalStringEnv`, `optionalNumberEnv`
- Usage examples
- Link to GENERAL_CODE_GUIDELINE.md "Never Default Environment Variables" rule

### 7.2 README.md for `@pack/event-inventory`

Contents:
- Purpose: single source of truth for all NATS event subjects across the platform
- Event naming conventions (lowercase dot-delimited)
- Full event catalog table with producer/consumer columns
- How to add new events

### 7.3 README.md for `@pack/env-orchestration`

Contents:
- Purpose: Docker Compose orchestration for the local development environment
- Port allocation table (copied from Phase 4.3)
- How to run: `pnpm infra`, `pnpm docker:up`, `pnpm docker:down`, `pnpm docker:ps`
- Per-micro infrastructure ownership table
- Topology diagram (mermaid)
- How to add a new microservice

### 7.4 README.md for Each Microservice

Create or update `README.md` for all 9 micros. Each should include:

| Section | Content |
|---------|---------|
| Overview | Service purpose, domain, and bounded context |
| Architecture | Clean Architecture layers (application, domain, infra, interface) |
| Transport | HTTP endpoints, NATS events emitted and consumed |
| Infrastructure | Own Mongo/Redis/MinIO (with docker container name) |
| Environment | `.env.template` variable reference |
| Development | How to run locally (`pnpm dev`) and in Docker |
| Events | Table of events emitted and consumed with subject names |

### 7.5 Update Context Documents

**`.agents/context/SERVICE_TRUTH_MATRIX.md`**:
- Replace shared infra topology section with per-micro ownership
- Remove all `shinod-ai` references
- Add petrified, fort-minor, stereo as individual services
- Update infrastructure section to reflect per-micro instances

**`.agents/context/ARCHITECTURE.md`**:
- Update "Shared Packages" section: remove `@env/*`, add `@pack/environment`, `@pack/event-inventory`, `@pack/env-orchestration`
- Update "Runtime Services" section: replace Shinod AI monolith with three individual AI micros
- Update dependency diagram
- Remove all `@env/core`, `@env/lib`, `@env/event-inventory` references

**`.agents/context/EVENTS_PIPELINE.md`**:
- Replace "Shinod AI" producer references with individual micro names (Petrified, Fort Minor, Stereo)
- No subject name changes needed (event names stay the same)

### 7.6 JSDoc Comments

Add JSDoc (`/** ... */`) to every new:
- Module class (NatsModule, MongodbModule, RedisModule, StorageModule)
- Provider (redisProvider, minioProvider, mongoUri, mongoDbName)
- Abstract class (AudioStoragePort)
- Adapter class (MinioAudioStorageAdapter)
- Enum (AuthorityEvent, UserEvent, TrackEvent) and each member
- Utility function (requireStringEnv, requireNumberEnv, optionalStringEnv, optionalNumberEnv)

Follow `.agents/rules/GENERAL_CODE_GUIDELINE.md` and `.agents/rules/BACKEND_CODE_GUIDELINE.md`.
