# Multi-stage Dockerfile for NestJS Enterprise Application

# -----------------------------------------------------------
# Stage 1: Build stage
# -----------------------------------------------------------
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code and assets
COPY . .

# Compile TypeScript into JavaScript in dist/
RUN npm run build

# Prune devDependencies to keep image lean
RUN npm prune --omit=dev

# -----------------------------------------------------------
# Stage 2: Production runtime stage
# -----------------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Run as non-root user for container security
USER node

# Copy production artifacts and dependencies
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/public ./public

# Expose NestJS server port
EXPOSE 3000

# Start compiled NestJS server
CMD ["node", "dist/main.js"]
