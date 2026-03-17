# Bug: `pnpm infra` failing due to missing `pnpm-lock.yaml`

## Summary

Every Dockerfile in the monorepo copies `pnpm-lock.yaml` into the build context, but the file may not exist when `pnpm infra` runs, causing Docker builds to fail with:

```
"/pnpm-lock.yaml": not found
```

## Root cause

- All Dockerfiles use: `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./`
- `pnpm-lock.yaml` is gitignored (line 14 of `.gitignore`) and gets deleted by `dx:cleanup`
- The `infra` script in [package.json](package.json) runs: `pnpm docker:down && pnpm dx:env:template && pnpm docker:up && pnpm docker:ps`
- No step generates the lockfile before `docker:up` triggers Docker builds

## Desired behavior

- `pnpm infra` should succeed even after `dx:cleanup` or on a fresh clone
- Lockfile must exist before Docker builds execute

## Fix

Add `pnpm install` to the `infra` script in [package.json](package.json) so the lockfile exists before Docker builds:

```json
"infra": "pnpm docker:down && pnpm dx:env:template && pnpm install && pnpm docker:up && pnpm docker:ps"
```

## References

- Affected: [package.json](package.json), all service Dockerfiles
- Related: [.gitignore](.gitignore), [bin/dx/tooling/cleanup.sh](bin/dx/tooling/cleanup.sh) (if it removes lockfile)

## Status

To be fixed.
