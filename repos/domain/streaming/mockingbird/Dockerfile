FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@micro/mockingbird

WORKDIR /workspace/domain/streaming/mockingbird
COPY domain/streaming/mockingbird/.env .env
EXPOSE 7200

CMD ["node", "dist/main.js"]
