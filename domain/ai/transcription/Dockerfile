FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain/ai/transcription ./domain/ai/transcription
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/transcription build

WORKDIR /workspace/domain/ai/transcription
COPY domain/ai/transcription/.env .env
EXPOSE 7201

CMD ["node", "dist/main.js"]
