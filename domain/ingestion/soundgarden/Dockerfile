FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/soundgarden build

WORKDIR /workspace/domain/ingestion/soundgarden
COPY domain/ingestion/soundgarden/.env .env
EXPOSE 7100

CMD ["node", "dist/main.js"]
