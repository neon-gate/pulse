FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/jwt-session build

WORKDIR /workspace/domain/identity/authority
COPY domain/identity/authority/.env .env
EXPOSE 7000

CMD ["node", "dist/main.js"]
