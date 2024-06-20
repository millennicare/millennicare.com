FROM node:18-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@millennicare/web --docker

FROM base AS installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

ARG TURBO_TOKEN

ENV TURBO_TOKEN=$TURBO_TOKEN

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=7724a2e1-e414-4d1c-a2c8-e9227b9096e5,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY .turbo/config.json ./.turbo/

## This would be useful for browser environment variables that are actually baked at build time and you aren't passing them in otherwise.
COPY .env .env
# RUN CI=true SKIP_ENV_VALIDATION=true turbo run build --filter=@millennicare/nextjs...
RUN --mount=type=bind,source=.git,target=.git \
    pnpm turbo build
FROM base AS runner
WORKDIR /app

EXPOSE 3000
ENV PORT 3000

ENV NODE_ENV production
ENV HOSTNAME localhost

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 web
USER web

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=web:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=web:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=web:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
