FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk add --no-cache ffmpeg

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/fort-minor build

WORKDIR /workspace/domain/streaming/fort-minor
EXPOSE 7002

CMD ["node", "dist/main.js"]
