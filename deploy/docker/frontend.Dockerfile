# ---- install deps ----
FROM node:20-alpine AS deps
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

# API_BASE_URL akan di-inject saat build image
ARG API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL

RUN npm run build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]
