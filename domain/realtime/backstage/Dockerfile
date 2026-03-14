FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain/realtime ./domain/realtime
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/backstage build

WORKDIR /workspace/domain/realtime/backstage
COPY domain/realtime/backstage/.env .env
EXPOSE 4001

CMD ["node", "dist/main.js"]
