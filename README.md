# Nuvelle Wedding

Nuvelle Wedding은 모바일 청첩장 제작 및 공유를 중심으로 한 풀스택 웹 애플리케이션입니다.
회원가입과 로그인을 기반으로 사용자는 청첩장 템플릿을 선택하고, 예식 정보와 사진, 인사말 등을 입력해 자신만의 모바일 청첩장을 만들 수 있습니다.

현재는 인증 기능과 템플릿 관리 기능을 중심으로 개발 중이며, 추후 청첩장 생성·수정·발행, 공개 URL 공유, RSVP, 방명록, 신혼여행 추천 기능까지 확장할 예정입니다.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Zustand
- Axios
- Tailwind CSS

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Redis
- JWT

## Features

- 회원가입
- 로그인
- JWT 기반 인증
- 비밀번호 암호화 저장
- Access Token / Refresh Token 발급
- 인증 상태 관리

## Project Structure

```text
Nuvelle-Wedding
├── frontend
└── backend
```

## Getting Started

### Backend

```bash
cd backend
./gradlew bootRun
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

Backend는 MySQL, Redis, JWT secret 설정이 필요합니다.

Frontend는 아래 환경변수를 사용합니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API

### Auth

- `POST /api/auth/signup` 회원가입
- `POST /api/auth/login` 로그인
- `POST /api/auth/reissue` 토큰 재발급
- `POST /api/auth/logout` 로그아웃
