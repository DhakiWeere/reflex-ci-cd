# Base
FROM node:20-alpine AS base

# Dep Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 reflex
RUN adduser --system --uid 1001 reflex

COPY --from=builder /app/public ./public
COPY --from=builder --chown=reflex:reflex /app/.next/standalone ./
COPY --from=builder --chown=reflex:reflex /app/.next/static ./.next/static

USER reflex

ENV GITHUB_OWNER=dhakiweere
ENV GITHUB_REPO=reflex-ci-cd
ENV GITHUB_PROD_REF=dev

ENV FILE_PATH_INDEX=reflex-web/src/app/page.jsx
ENV FILE_PATH_CSS=reflex-web/src/app/global.css


EXPOSE 3000

CMD ["node", "server.js"]