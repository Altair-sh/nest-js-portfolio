# Build stage: install node_modules and pack them with src in dist/main.js
FROM node:26-alpine AS builder
WORKDIR /app
# Install dependencies before source code.
# If source code changes, `docker build` will use cached dependencies
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: only Node + dist/main.js, no node_modules
FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist/main.js ./main.js
# non-root user provided by the node image
USER node
EXPOSE 3000
CMD ["node", "main.js"]
