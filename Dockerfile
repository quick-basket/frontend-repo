# Use an official Node runtime as the base image
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
COPY .env.local .env.local
RUN npm run build

# Setup development image
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.env.local .env.local
COPY . .

# Run the app
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]