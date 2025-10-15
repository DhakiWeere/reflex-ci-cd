# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json / lock file
COPY package*.json ./

# Install dependencies
# RUN npm ci
RUN npm install

# Copy rest of the app
COPY . .

# Build the Next.js project
RUN npm run build

# runner stage
FROM node:18-alpine AS runner

# set working directory
WORKDIR /app

# copy from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# ENV variables
ENV NODE_ENV=production

ENV GITHUB_TOKEN=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
ENV GITHUB_OWNER=dhakiweere
ENV GITHUB_REPO=reflex-ci-cd
ENV GITHUB_PROD_REF=dev

ENV FILE_PATH_INDEX=reflex-web/src/app/page.jsx
ENV FILE_PATH_CSS=reflex-web/src/app/global.css

# Expose your desired port (3000 by default)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start", "--", "-p", "3000"]


