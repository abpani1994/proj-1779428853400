FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund || \
      (echo "lockfile out of sync — regenerating" && rm -f package-lock.json && npm install --no-audit --no-fund); \
    else \
      npm install --no-audit --no-fund; \
    fi
COPY frontend/ ./
RUN npm run build

FROM node:20-slim AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund || \
      (echo "lockfile out of sync — regenerating" && rm -f package-lock.json && npm install --no-audit --no-fund); \
    else \
      npm install --no-audit --no-fund; \
    fi

FROM node:20-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
RUN npx prisma generate

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app/backend/node_modules/.prisma
RUN chown -R appuser:appgroup /app/backend/prisma

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && dumb-init node server.js"]
