# Use an official Node runtime as the base image
FROM node:18 AS base
WORKDIR /usr/src/app

# Install dependencies and build the application
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Setup production image
FROM base AS release
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/public ./public

# Run the app
USER node
EXPOSE 3000
ENV NODE_ENV=development
CMD ["node", "server.js"]