# ---- Build Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack to use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# ---- Production Stage ----
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/api/index.mjs"]
