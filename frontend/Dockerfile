FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_KAKAO_APP_KEY
ARG NEXT_PUBLIC_KAKAO_REST_API_KEY
ARG NEXT_PUBLIC_KAKAO_REDIRECT_URI
ARG NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_KAKAO_APP_KEY=$NEXT_PUBLIC_KAKAO_APP_KEY
ENV NEXT_PUBLIC_KAKAO_REST_API_KEY=$NEXT_PUBLIC_KAKAO_REST_API_KEY
ENV NEXT_PUBLIC_KAKAO_REDIRECT_URI=$NEXT_PUBLIC_KAKAO_REDIRECT_URI
ENV NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=$NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
