FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=pulse

WORKDIR /workspace/apps/pulse
COPY apps/pulse/.env .env
EXPOSE 3000

CMD ["pnpm", "start"]
