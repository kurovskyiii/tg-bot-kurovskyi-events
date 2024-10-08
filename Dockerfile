FROM node:lts-slim AS base

# Create app directory
WORKDIR /usr/src

FROM base AS builder

# Files required by npm install
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Type check app
RUN npm run typecheck

FROM base AS runner

# Files required by npm install
COPY package*.json ./

# Install only production app dependencies
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Ensure the data directory exists and set proper permissions
RUN mkdir -p /usr/src/data && chown -R node:node /usr/src/data

USER node

# Start the app
EXPOSE 80
CMD ["node", "--import", "tsx", "./src/main.ts"]
