# 1. 베이스 이미지 설정
FROM node:20-alpine AS base

# 2. pnpm 설치
RUN npm i -g pnpm

# 3. 작업 디렉토리 설정
WORKDIR /usr/src/app

# Compose 파일에서 전달받을 빌드 인자 선언
ARG NEXT_PUBLIC_API_URL
# 빌드 과정에서 사용할 환경 변수로 설정
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# 4. 의존성 설치를 위한 스테이지
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile


# 5. 빌드 스테이지
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm build


# 6. 프로덕션 실행 스테이지
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3002

CMD ["node", "server.js"] 