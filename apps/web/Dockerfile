ARG NODE_ENV=production

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
ARG RAILWAY_SERVICE_ID
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID},target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
COPY .turbo/config.json ./.turbo/

COPY .env .env
RUN --mount=type=bind,source=.git,target=.git \
    pnpm turbo build
FROM base AS runner
WORKDIR /app

EXPOSE 3000
ENV PORT 3000

ENV NODE_ENV production
ENV HOSTNAME localhost

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 web
USER web

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/public ./apps/nextjs/public

CMD node apps/web/server.js
