FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain/ai/fake-cognition ./domain/ai/fake-cognition
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/cognition-fake build

WORKDIR /workspace/domain/ai/fake-cognition
COPY domain/ai/fake-cognition/.env .env
EXPOSE 7300

CMD ["node", "dist/main.js"]
