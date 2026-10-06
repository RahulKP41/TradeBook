FROM node:22-alpine AS base

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Install dependencies only
FROM base AS deps
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json* ./
RUN npm ci --ignore-scripts && npm prune prod

# Build
FROM base AS builder
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json* ./
RUN npm ci
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

USER nextjs

EXPOSE 8080

CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]