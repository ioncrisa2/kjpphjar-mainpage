# syntax=docker/dockerfile:1

# ==========================================
# 1. Build Stage
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build Nuxt 3 application for production
ENV NODE_ENV=production
RUN npm run build

# ==========================================
# 2. Production Runner Stage
# ==========================================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Default environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV UPLOADS_DIR=/app/uploads

# Install curl for container health check
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create persistent uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

# Copy compiled Nuxt / Nitro output from builder
COPY --from=builder --chown=node:node /app/.output ./.output

# Use non-root node user for security
USER node

EXPOSE 3000

# Health check to ensure the server responds
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the Nitro production server
CMD ["node", ".output/server/index.mjs"]
