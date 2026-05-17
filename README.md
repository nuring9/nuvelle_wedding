# Nuvelle Wedding

> 모바일 청첩장 제작과 공유를 위한 풀스택 웹 애플리케이션입니다.

Nuvelle Wedding은 사용자가 청첩장 템플릿을 선택하고, 예식 정보와 사진, 인사말 등을 입력해 자신만의 모바일 청첩장을 제작할 수 있도록 설계한 서비스입니다.

현재는 **회원 인증, JWT 기반 로그인, 템플릿 조회, 청첩장 제작 화면**을 중심으로 개발 중이며, 추후 청첩장 발행, 공개 URL 공유, RSVP, 방명록, 신혼여행 추천 기능까지 확장할 예정입니다.

<br />

## 프로젝트 소개

Nuvelle Wedding은 모바일 환경에서 예비 부부가 간편하게 청첩장을 만들고 공유할 수 있도록 돕는 웹 서비스입니다.

사용자는 회원가입과 로그인 후 원하는 청첩장 템플릿을 선택하고, 신랑·신부 정보, 예식 일시, 예식장 정보, 인사말, 갤러리, 계좌 정보 등을 입력해 모바일 청첩장을 구성할 수 있습니다.

프론트엔드는 Next.js 기반으로 제작하고 있으며, 백엔드는 Spring Boot 기반 REST API 서버로 구성했습니다.

<br />

## 주요 기능

### 인증 기능

- 회원가입
- 로그인
- 로그아웃
- JWT 기반 인증 처리
- Access Token / Refresh Token 발급
- Refresh Token 기반 토큰 재발급
- 비밀번호 암호화 저장
- 프론트엔드 인증 상태 관리

### 템플릿 기능

- 청첩장 템플릿 목록 조회
- 템플릿 단건 조회
- 템플릿 카드 UI 구성
- 템플릿 미리보기 화면 구성
- 템플릿 선택 후 청첩장 제작 화면 이동

### 청첩장 제작 기능

- 청첩장 기본 정보 입력
- 신랑·신부 정보 입력
- 혼주 정보 입력
- 예식 일시 및 장소 입력
- 인사말 입력
- 갤러리 섹션 구성
- 계좌 정보 입력
- 섹션 노출 여부 설정
- 청첩장 저장 바 및 발행 패널 UI 구성

### 향후 확장 예정 기능

- 청첩장 생성·수정·발행 API 연동 고도화
- 공개 URL 기반 청첩장 공유
- RSVP 참석 여부 응답
- 방명록 작성
- 지도 연동
- 사진 업로드
- 신혼여행 추천 기능
- 관리자 템플릿 관리 기능

<br />

## 기술 스택

### Frontend

`Next.js 16` `React 19` `TypeScript` `Zustand` `Axios`  
`Tailwind CSS` `dayjs` `clsx` `tailwind-merge`

### Backend

`Java 21` `Spring Boot 4` `Spring Web MVC` `Spring Security`  
`Spring Data JPA` `MySQL` `Redis` `JWT` `Lombok` `AWS S3`

### Infra / Tooling

`Gradle` `npm` `ESLint` `Docker Compose`

<br />

## 프로젝트 구조

```text
Nuvelle-Wedding
├── backend
│   └── src/main/java/com/nuvelle/wedding
│       ├── auth
│       │   ├── controller
│       │   ├── dto
│       │   ├── jwt
│       │   ├── security
│       │   └── service
│       ├── template
│       │   ├── controller
│       │   ├── dto
│       │   ├── entity
│       │   ├── repository
│       │   └── service
│       ├── user
│       │   ├── entity
│       │   └── repository
│       └── global
│           ├── config
│           ├── exception
│           └── response
│
└── frontend
    └── src
        ├── app
        │   ├── (auth)
        │   ├── invitation-editor
        │   └── invitations
        ├── components
        │   ├── common
        │   ├── invitation-editor
        │   └── template
        ├── hooks
        ├── lib
        │   └── api
        ├── stores
        └── types
```

<br />

## 주요 화면 흐름

1. 사용자가 회원가입 또는 로그인을 진행합니다.
2. 로그인 후 청첩장 템플릿 목록을 확인합니다.
3. 원하는 템플릿을 선택합니다.
4. 청첩장 제작 화면에서 예식 정보, 인사말, 갤러리, 계좌 정보 등을 입력합니다.
5. 청첩장 저장 및 발행 흐름으로 이어질 수 있도록 화면을 구성합니다.

<br />

## 주요 API

### Auth

| Method | URL | 설명 |
| --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/reissue` | 토큰 재발급 |
| POST | `/api/auth/logout` | 로그아웃 |

### Template

| Method | URL | 설명 |
| --- | --- | --- |
| GET | `/api/templates` | 템플릿 목록 조회 |
| GET | `/api/templates/{templateId}` | 템플릿 단건 조회 |

<br />

## 실행 방법

### Backend

```bash
cd backend
./gradlew bootRun
```

Backend 기본 주소:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend 기본 주소:

```text
http://localhost:3000
```

<br />

## 환경 변수

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend

Backend는 MySQL, Redis, JWT secret 설정이 필요합니다.

```env
JWT_SECRET=
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
SPRING_DATA_REDIS_HOST=
SPRING_DATA_REDIS_PORT=
```

<br />

## 구현하며 고려한 점

- JWT 기반 인증 구조를 적용해 로그인 상태를 유지할 수 있도록 구성했습니다.
- Access Token과 Refresh Token을 분리해 토큰 재발급 흐름을 설계했습니다.
- 비밀번호는 평문으로 저장하지 않고 암호화하여 저장하도록 구성했습니다.
- 프론트엔드에서는 Zustand를 활용해 인증 상태를 전역에서 관리할 수 있도록 했습니다.
- 청첩장 제작 화면은 기본 정보, 예식 정보, 갤러리, 계좌, 섹션 설정 등 기능 단위로 컴포넌트를 분리했습니다.
- 공통 입력 컴포넌트와 버튼 컴포넌트를 분리해 화면 간 UI 일관성을 유지할 수 있도록 했습니다.
- 백엔드는 인증, 템플릿, 사용자, 전역 예외 처리 영역을 분리해 기능별 책임을 명확히 했습니다.

<br />

## 기대 효과

- 사용자는 모바일 청첩장을 직접 제작하고 관리할 수 있습니다.
- 템플릿 기반 제작 흐름을 통해 청첩장 제작 과정을 단순화할 수 있습니다.
- 예식 정보, 인사말, 갤러리, 계좌 정보 등을 한 화면 흐름 안에서 관리할 수 있습니다.
- 추후 공개 URL, RSVP, 방명록 기능을 추가하면 실제 청첩장 공유 서비스로 확장할 수 있습니다.
