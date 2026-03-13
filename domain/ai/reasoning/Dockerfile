FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain/ai/reasoning ./domain/ai/reasoning
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @micro/reasoning build

WORKDIR /workspace/domain/ai/reasoning
COPY domain/ai/reasoning/.env.template .env
EXPOSE 7202

CMD ["node", "dist/main.js"]
