FROM node:20-alpine

WORKDIR /workspace
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY domain ./domain
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@micro/slim-shady

WORKDIR /workspace/domain/identity/slim-shady
COPY domain/identity/slim-shady/.env .env
EXPOSE 7400

CMD ["node", "dist/main.js"]
