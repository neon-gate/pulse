FROM node:20-alpine

# FFmpeg and Chromaprint (fpcalc) for audio fingerprinting.
RUN apk add --no-cache ffmpeg chromaprint

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@micro/shinod-ai

WORKDIR /workspace/domain/ai/shinod-ai
COPY domain/ai/shinod-ai/.env .env
EXPOSE 7200

CMD ["node", "dist/main.js"]
