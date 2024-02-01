# ARG NODE_VERSION=18.17.1
# ARG ALPINE_VERSION=3.17

# FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

# RUN npm i -g pnpm@8.7.5
# RUN npm i -g turbo@1.10.14

# FROM base AS builder

# # Set working directory
# WORKDIR /app
# COPY . .
# RUN turbo prune --scope=nextjs --docker

# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# WORKDIR /app



# # First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ ./
# COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# RUN pnpm install --frozen-lockfile

# # Build the project
# COPY --from=builder /app/out/full/ ./
# RUN CI=true SKIP_ENV_VALIDATION=1 pnpm build --filter=@millennicare/nextjs

# FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner
# WORKDIR /app

# COPY --from=installer /app/apps/nextjs/next.config.js .
# COPY --from=installer /app/apps/nextjs/package.json .

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=installer /app/apps/nextjs/.next/standalone ./
# COPY --from=installer /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
# COPY --from=installer /app/apps/nextjs/public ./apps/nextjs/public

# CMD node apps/nextjs/server.js

ARG NODE_VERSION=18.18.0

# Alpine image
FROM node:21-alpine3.18 AS alpine
RUN apk update
# RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine as base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune projects
FROM base AS pruner

WORKDIR /app
COPY . .
RUN turbo prune --scope=@millennicare/nextjs --docker

# Build the project
FROM base AS builder
ARG PROJECT

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN turbo build --filter=@millennicare/nextjs
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/@millennicare/nextjs

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD node dist/main