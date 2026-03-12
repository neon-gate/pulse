# 🛠 Developer Tooling — `bin/` and DX Scripts

The `bin/` directory contains the **developer tooling and operational scripts** used throughout the repository.

These scripts power the **Developer Experience (DX)** of the project by providing consistent commands for:

* local infrastructure orchestration
* environment setup
* repository maintenance
* smoke testing
* Git workflow enforcement

Instead of relying on ad-hoc commands or manual setup, the project provides a **scripted development environment** that allows any developer to bootstrap and operate the system quickly and consistently.

---

# Philosophy

The goal of the `bin/` tooling is to ensure that every developer can run the project with a **predictable and reproducible environment**.

This includes:

* deterministic infrastructure startup
* automated environment setup
* consistent formatting and linting
* standardized commit messages
* automated smoke tests

Together, these tools reduce onboarding friction and help maintain **engineering discipline across the codebase**.

---

# Repository Tooling Stack

The repository uses several developer tooling systems working together.

| Tool                       | Purpose                        |
| -------------------------- | ------------------------------ |
| **Turborepo**              | Monorepo task orchestration    |
| **pnpm**                   | Package management             |
| **Docker Compose**         | Infrastructure orchestration   |
| **Husky**                  | Git hook management            |
| **Commitlint**             | Commit message standardization |
| **Biome**                  | Formatting and linting         |
| **VSCode workspace rules** | Enforced editor consistency    |

These tools combine to create a **structured and consistent development workflow**.

---

# bin/ Directory Structure

```
bin
├─ docker
│  ├─ docker-up.sh
│  ├─ docker-down.sh
│  └─ docker-ps.sh
│
├─ dx
│  ├─ tooling
│  │  ├─ cleanup.sh
│  │  └─ env-template.sh
│  │
│  └─ test
│     ├─ smoke.sh
│     └─ smoke
│        ├─ off
│        │  └─ smoke-off.sh
│        └─ pulse
│           └─ smoke-bff.sh
│
└─ hooks
   ├─ pre-commit.sh
   ├─ commit-msg.sh
   └─ post-pull.sh
```

Each directory groups tooling by responsibility.

---

# 🐳 Docker Infrastructure Orchestration

The `bin/docker` scripts manage **local infrastructure services** using **Docker Compose**.

These scripts wrap Docker commands to provide a **consistent developer interface**.

Infrastructure services include:

* MongoDB
* Redis
* RabbitMQ
* NATS

These services form the **foundation of the platform's local runtime environment**.

---

## docker-up.sh

Starts infrastructure and application services.

Example usage:

```
pnpm docker:up
```

This launches services defined in `docker-compose.yml`.

The script supports different startup targets.

```
infra   → start infrastructure only
apps    → start application services
all     → start everything
```

This separation allows developers to run only the services they need.

---

## docker-down.sh

Stops and removes running services.

Example:

```
pnpm docker:down
```

This ensures the local environment can be **reset cleanly**.

---

## docker-ps.sh

Displays the current running containers.

Example:

```
pnpm docker:ps
```

This provides a quick view of the system's running services.

---

# ⚙️ Developer Experience (DX) Tooling

The `bin/dx` directory contains scripts that automate common development tasks.

These scripts provide **higher-level developer workflows** beyond simple infrastructure commands.

---

# DX Infrastructure Bootstrap

A common developer workflow is:

```
pnpm dx:infra
```

Which executes:

```
pnpm docker:down
pnpm docker:up
pnpm docker:ps
```

This sequence ensures that the entire infrastructure stack is **restarted cleanly**.

It is useful when:

* infrastructure becomes inconsistent
* containers fail
* local environments need resetting

---

# DX Cleanup

The cleanup script removes local build artifacts and dependency directories.

```
pnpm dx:cleanup
```

This typically removes:

* `node_modules`
* `.turbo` cache
* build artifacts

It ensures the repository can return to a **clean state**.

---

# DX Reset

```
pnpm dx:reset
```

This command performs a **full repository reset**:

```
cleanup
↓
install dependencies
↓
rebuild packages
```

It is commonly used when:

* dependencies become corrupted
* caches produce inconsistent builds
* onboarding a new developer environment

---

# Environment Template Generation

The repository uses `.env.template` files to define environment variables.

To generate local environment files:

```
pnpm dx:env:template
```

This script scans the repository for:

```
.env.template
```

and produces local `.env` files from them.

This simplifies environment setup and ensures that all services have the **required configuration variables**.

---

# 🧪 Smoke Testing

Smoke tests provide **basic runtime verification** that the system is functioning correctly.

Smoke tests are not comprehensive tests; they simply confirm that the **core services are alive and responding**.

---

## Run Smoke Tests

```
pnpm dx:smoke
```

This runs:

```
smoke/off/smoke-off.sh    (auth microservice)
smoke/pulse/smoke-bff.sh  (Pulse API)
```

These scripts validate critical services such as:

* authentication endpoints
* the Pulse BFF proxy to the auth service

Smoke tests are useful after:

* infrastructure startup
* deployments
* major configuration changes

---

# 🔐 Git Workflow Enforcement

The repository enforces **commit discipline** using Git hooks.

Git hooks are managed through **Husky**.

Hooks live inside:

```
bin/hooks
```

---

# commit-msg Hook

The `commit-msg` hook validates commit messages using **Commitlint**.

All commits must follow the **Conventional Commit specification**.

Example format:

```
type(scope): description
```

Example commits:

```
feat(auth): add refresh token endpoint
fix(player): handle empty playlist
docs(readme): update architecture overview
```

Allowed commit types include:

* feat
* fix
* docs
* style
* refactor
* test
* chore

This structure enables:

* consistent commit history
* automated changelog generation
* semantic versioning workflows

---

# pre-commit Hook

The pre-commit hook is responsible for running development checks before commits.

Typical checks include:

* linting
* formatting
* staged file validation

The repository uses **Biome** and **lint-staged** to automatically format code before commits.

This ensures code style remains consistent across the codebase.

---

# VSCode Workspace Rules

The repository includes workspace configuration to enforce consistent development environments.

This may include:

* formatting rules
* recommended extensions
* workspace settings
* TypeScript configuration

Combined with Biome formatting, this ensures developers have a **uniform coding environment regardless of local setup**.

---

# Monorepo Task Orchestration

The repository uses **Turborepo** for monorepo task orchestration.

Key commands include:

```
pnpm dev
pnpm build
```

These commands execute tasks across packages using Turborepo's dependency graph.

Benefits include:

* incremental builds
* task caching
* faster development workflows

---

# Example Developer Workflow

A typical developer workflow may look like:

```
git clone repository
↓
pnpm install
↓
pnpm dx:env:template
↓
pnpm dx:infra
↓
pnpm dev
```

At this point:

* infrastructure services are running
* environment variables are configured
* applications are available locally

Developers can begin building features immediately.

---

# Summary

The `bin/` directory provides the **operational backbone of the development environment**.

Through Docker orchestration, DX automation scripts, and Git workflow enforcement, the project ensures:

* consistent development environments
* reproducible infrastructure setup
* standardized commits and formatting
* automated system verification

These practices significantly improve developer productivity and help maintain a **healthy and scalable engineering workflow** within the monorepo.
