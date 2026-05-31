# Nuvelle Wedding

> 모바일 청첩장 제작, 공유, 참석 응답, 방명록, 신혼여행 플래너까지 제공하는 풀스택 웹 애플리케이션입니다.

Nuvelle Wedding은 사용자가 청첩장 템플릿을 선택하고, 예식 정보와 사진, 인사말, 계좌 정보 등을 입력해 자신만의 모바일 청첩장을 제작하고 공개 URL로 공유할 수 있도록 설계한 서비스입니다.

현재는 **회원 인증, 카카오 로그인, 청첩장 제작·발행, 공개 청첩장 조회, RSVP, 방명록, 게스트 사진, BGM, 관리자 기능, AI 신혼여행 플래너**까지 구현되어 있습니다.

<br />

## 배포 주소

- Service: https://nuvelle-wedding.site/

<br />

## 프로젝트 소개

Nuvelle Wedding은 모바일 환경에서 예비 부부가 간편하게 청첩장을 만들고 공유할 수 있도록 돕는 웹 서비스입니다.

사용자는 회원가입 또는 카카오 로그인을 통해 서비스를 이용할 수 있으며, 원하는 템플릿을 선택한 뒤 신랑·신부 정보, 예식 일시, 예식장 정보, 인사말, 갤러리, 계좌 정보, 인터뷰, 지도, BGM 등을 입력해 모바일 청첩장을 구성할 수 있습니다.

완성된 청첩장은 공개 URL로 발행할 수 있으며, 하객은 별도 로그인 없이 청첩장을 확인하고 참석 여부 응답, 방명록 작성, 게스트 사진 등록 등의 기능을 이용할 수 있습니다.

프론트엔드는 Next.js 기반으로 제작했으며, 백엔드는 Spring Boot 기반 REST API 서버로 구성했습니다.

<br />

## 주요 기능

### 인증 기능

- 회원가입
- 로그인
- 로그아웃
- JWT 기반 인증 처리
- Access Token / Refresh Token 발급
- Refresh Token 기반 토큰 재발급
- 카카오 소셜 로그인
- 비밀번호 재설정 요청 및 변경
- 비밀번호 암호화 저장
- 프론트엔드 인증 상태 관리
- 회원 탈퇴

### 템플릿 기능

- 청첩장 템플릿 목록 조회
- 템플릿 단건 조회
- 템플릿 카드 UI 구성
- 템플릿 미리보기 화면 구성
- 템플릿 선택 후 청첩장 제작 화면 이동
- 관리자 템플릿 등록, 수정, 삭제
- 관리자 마스터 청첩장 연결

### 청첩장 제작 기능

- 청첩장 생성, 수정, 삭제
- 내 청첩장 목록 조회
- 청첩장 기본 정보 입력
- 신랑·신부 정보 입력
- 혼주 정보 입력
- 예식 일시 및 장소 입력
- 인사말 입력
- 프로필 정보 입력
- 갤러리 이미지 구성
- 계좌 정보 입력
- 인터뷰 문답 입력
- 지도 섹션 설정
- BGM 설정
- 애니메이션 설정
- QR 코드 영역 구성
- 섹션 노출 여부 설정
- 섹션 순서 변경
- 청첩장 실시간 미리보기
- 청첩장 임시저장, 발행, 비공개 전환

### 공개 청첩장 기능

- 공개 URL 기반 청첩장 조회
- 공개 청첩장 섹션 렌더링
- D-Day 표시
- 갤러리 표시
- 계좌 정보 및 송금 안내 표시
- 카카오 지도 연동
- BGM 재생
- QR 코드 표시
- 참석 여부 응답
- 방명록 작성 및 조회
- 게스트 사진 등록 및 조회

### RSVP 기능

- 하객 참석 여부 응답
- 참석자 정보 입력
- 식사 여부 입력
- 동행 인원 입력
- 청첩장 소유자 RSVP 목록 조회

### 방명록 기능

- 공개 청첩장 방명록 작성
- 방명록 목록 조회
- 방명록 숨김 처리

### 파일 기능

- 이미지 파일 업로드
- S3 기반 파일 저장
- 업로드 파일 삭제
- 청첩장 갤러리 이미지 관리
- 게스트 사진 업로드

### 신혼여행 플래너 기능

- AI 기반 신혼여행 일정 생성
- 내 신혼여행 플랜 목록 조회
- 플랜 상세 조회
- 플랜 저장
- 플랜 수정 및 삭제
- 일자별 여행 일정 수정
- AI 채팅 기반 일정 상담
- AI 답변을 기반으로 새 플랜 생성
- 여행지 번역 캐시
- Unsplash 이미지 연동
- PDF 출력용 화면 구성

### 관리자 기능

- 관리자 대시보드
- 회원 목록 조회
- 회원 상세 조회
- 회원 상태 변경
- 회원 권한 변경
- 회원 탈퇴 처리
- 청첩장 목록 및 상세 조회
- 템플릿 관리
- BGM 등록, 수정, 삭제

<br />

## 기술 스택

### Frontend

`Next.js 16` `React 19` `TypeScript` `Zustand` `Axios`  
`Tailwind CSS` `dayjs` `clsx` `tailwind-merge`  
`@dnd-kit` `html2canvas` `jsPDF` `QRCode`

### Backend

`Java 21` `Spring Boot 4` `Spring Web MVC` `Spring Security`  
`Spring Data JPA` `MySQL` `Redis` `JWT` `Lombok`  
`AWS S3` `Gemini API`

### Infra / Deployment

`AWS EC2` `AWS RDS MySQL` `AWS S3`  
`Docker` `Docker Compose` `Nginx` `Redis`

### Tooling

`Gradle` `npm` `ESLint`

<br />

## 배포 구조

Nuvelle Wedding은 AWS EC2 한 대를 중심으로 배포했습니다.

사용자는 도메인 또는 EC2 Public IP로 서비스에 접속하고, EC2 내부의 Nginx 컨테이너가 요청 경로에 따라 프론트엔드와 백엔드 컨테이너로 트래픽을 분기합니다.

```text
사용자
  ↓
도메인 / EC2 Public IP
  ↓
Nginx (EC2 내부 Docker 컨테이너)
  ├─ /        → Next.js 컨테이너
  └─ /api     → Spring Boot 컨테이너
                  ├─ AWS RDS MySQL 연결
                  ├─ Redis 컨테이너 연결
                  └─ AWS S3 이미지 업로드/조회
```

### EC2

- Docker Compose 기반으로 전체 서비스를 실행합니다.
- Nginx, Next.js, Spring Boot, Redis 컨테이너를 관리합니다.
- 외부 요청은 Nginx 컨테이너가 먼저 받습니다.

### Nginx

- `/` 경로 요청은 Next.js 프론트엔드 컨테이너로 전달합니다.
- `/api` 경로 요청은 Spring Boot 백엔드 컨테이너로 전달합니다.
- 프론트엔드와 백엔드를 하나의 도메인에서 사용할 수 있도록 리버스 프록시 역할을 합니다.

### Frontend

- Next.js 애플리케이션을 Docker 컨테이너로 실행합니다.
- 사용자 화면, 청첩장 제작 화면, 공개 청첩장 화면, 관리자 화면을 제공합니다.

### Backend

- Spring Boot 애플리케이션을 Docker 컨테이너로 실행합니다.
- 인증, 청첩장, RSVP, 방명록, 파일 업로드, 신혼여행 플래너, 관리자 API를 제공합니다.

### Database / Storage

- AWS RDS MySQL을 메인 데이터베이스로 사용합니다.
- Redis는 EC2 내부 Docker 컨테이너로 실행하며 Refresh Token 등 캐시성 데이터를 관리합니다.
- AWS S3를 사용해 청첩장 이미지, 갤러리 이미지, 게스트 사진 등의 파일을 저장합니다.

<br />

## 프로젝트 구조

```text
Nuvelle-Wedding
├── backend
│   └── src/main/java/com/nuvelle/wedding
│       ├── admin
│       ├── auth
│       ├── bgm
│       ├── file
│       ├── global
│       ├── guestbook
│       ├── guestphoto
│       ├── honeymoon
│       ├── invitation
│       ├── rsvp
│       ├── template
│       └── user
│
├── frontend
│   └── src
│       ├── app
│       │   ├── (auth)
│       │   ├── admin
│       │   ├── api
│       │   ├── auth
│       │   ├── honeymoon
│       │   ├── invitations
│       │   ├── invite
│       │   ├── mypage
│       │   └── templates
│       ├── components
│       │   ├── common
│       │   ├── guestbook
│       │   ├── honeymoon
│       │   ├── invitation-editor
│       │   ├── invitation-view
│       │   ├── rsvp
│       │   └── template
│       ├── constants
│       ├── hooks
│       ├── lib
│       │   └── api
│       ├── stores
│       └── types
│
├── docker-compose.yml
└── docker-compose.prod.yml
```

<br />

## 주요 화면 흐름

1. 사용자가 회원가입, 일반 로그인 또는 카카오 로그인을 진행합니다.
2. 로그인 후 청첩장 템플릿 목록을 확인합니다.
3. 원하는 템플릿을 선택하고 미리보기 화면을 확인합니다.
4. 청첩장 제작 화면에서 기본 정보, 예식 정보, 인사말, 갤러리, 계좌, 지도, BGM, 인터뷰 등을 입력합니다.
5. 실시간 미리보기로 완성 상태를 확인합니다.
6. 청첩장을 저장하거나 공개 URL로 발행합니다.
7. 하객은 공개 청첩장에서 참석 여부 응답, 방명록 작성, 게스트 사진 등록을 할 수 있습니다.
8. 사용자는 내 청첩장 관리 화면에서 청첩장을 편집, 삭제, RSVP 확인할 수 있습니다.
9. 신혼여행 플래너에서 AI 기반 여행 일정을 생성하고 수정할 수 있습니다.
10. 관리자는 관리자 화면에서 회원, 청첩장, 템플릿, BGM을 관리할 수 있습니다.

<br />

## 주요 API

### Auth

| Method | URL                                | 설명                 |
| ------ | ---------------------------------- | -------------------- |
| POST   | `/api/auth/signup`                 | 회원가입             |
| POST   | `/api/auth/login`                  | 로그인               |
| POST   | `/api/auth/reissue`                | 토큰 재발급          |
| POST   | `/api/auth/logout`                 | 로그아웃             |
| POST   | `/api/auth/kakao`                  | 카카오 로그인        |
| POST   | `/api/auth/password-reset/request` | 비밀번호 재설정 요청 |
| POST   | `/api/auth/password-reset/confirm` | 비밀번호 재설정 완료 |

### User

| Method | URL                      | 설명      |
| ------ | ------------------------ | --------- |
| PATCH  | `/api/users/me/withdraw` | 회원 탈퇴 |

### Template

| Method | URL                           | 설명             |
| ------ | ----------------------------- | ---------------- |
| GET    | `/api/templates`              | 템플릿 목록 조회 |
| GET    | `/api/templates/{templateId}` | 템플릿 단건 조회 |

### Invitation

| Method | URL                                                 | 설명                |
| ------ | --------------------------------------------------- | ------------------- |
| POST   | `/api/invitations`                                  | 청첩장 생성         |
| GET    | `/api/invitations`                                  | 내 청첩장 목록 조회 |
| GET    | `/api/invitations/{invitationId}`                   | 청첩장 상세 조회    |
| PATCH  | `/api/invitations/{invitationId}`                   | 청첩장 수정         |
| POST   | `/api/invitations/{invitationId}/publish`           | 청첩장 발행         |
| POST   | `/api/invitations/{invitationId}/private`           | 청첩장 비공개 전환  |
| DELETE | `/api/invitations/{invitationId}`                   | 청첩장 삭제         |
| POST   | `/api/invitations/{invitationId}/gallery`           | 갤러리 이미지 추가  |
| DELETE | `/api/invitations/{invitationId}/gallery/{imageId}` | 갤러리 이미지 삭제  |

### Public Invitation

| Method | URL                              | 설명             |
| ------ | -------------------------------- | ---------------- |
| GET    | `/api/public/invitations/{slug}` | 공개 청첩장 조회 |

### RSVP

| Method | URL                                     | 설명           |
| ------ | --------------------------------------- | -------------- |
| POST   | `/api/public/invitations/{slug}/rsvp`   | 참석 여부 응답 |
| GET    | `/api/invitations/{invitationId}/rsvps` | RSVP 목록 조회 |

### Guestbook

| Method | URL                                        | 설명             |
| ------ | ------------------------------------------ | ---------------- |
| POST   | `/api/public/invitations/{slug}/guestbook` | 방명록 작성      |
| GET    | `/api/public/invitations/{slug}/guestbook` | 방명록 조회      |
| PATCH  | `/api/guestbooks/{guestbookId}`            | 방명록 숨김 처리 |

### Guest Photo

| Method | URL                                           | 설명               |
| ------ | --------------------------------------------- | ------------------ |
| POST   | `/api/public/invitations/{slug}/guest-photos` | 게스트 사진 업로드 |
| GET    | `/api/public/invitations/{slug}/guest-photos` | 게스트 사진 조회   |

### File

| Method | URL                 | 설명        |
| ------ | ------------------- | ----------- |
| POST   | `/api/files/upload` | 파일 업로드 |
| DELETE | `/api/files`        | 파일 삭제   |

### BGM

| Method | URL         | 설명          |
| ------ | ----------- | ------------- |
| GET    | `/api/bgms` | BGM 목록 조회 |

### Honeymoon

| Method | URL                                                          | 설명                     |
| ------ | ------------------------------------------------------------ | ------------------------ |
| POST   | `/api/honeymoon/plans/generate`                              | AI 신혼여행 플랜 생성    |
| GET    | `/api/honeymoon/plans`                                       | 내 플랜 목록 조회        |
| GET    | `/api/honeymoon/plans/{planId}`                              | 플랜 상세 조회           |
| PATCH  | `/api/honeymoon/plans/{planId}`                              | 플랜 수정                |
| POST   | `/api/honeymoon/plans/{planId}/save`                         | 플랜 저장                |
| DELETE | `/api/honeymoon/plans/{planId}`                              | 플랜 삭제                |
| PATCH  | `/api/honeymoon/plans/{planId}/days/{dayId}`                 | 일자별 일정 수정         |
| POST   | `/api/honeymoon/plans/{planId}/chat`                         | AI 채팅                  |
| GET    | `/api/honeymoon/plans/{planId}/chat`                         | 채팅 내역 조회           |
| POST   | `/api/honeymoon/plans/{planId}/chat/{messageId}/create-plan` | 채팅 답변 기반 플랜 생성 |
| POST   | `/api/honeymoon/destinations/translate`                      | 여행지 번역              |

### Admin

| Method | URL                                                   | 설명                    |
| ------ | ----------------------------------------------------- | ----------------------- |
| GET    | `/api/admin/users`                                    | 회원 목록 조회          |
| GET    | `/api/admin/users/{userId}`                           | 회원 상세 조회          |
| PATCH  | `/api/admin/users/{userId}/status`                    | 회원 상태 변경          |
| PATCH  | `/api/admin/users/{userId}/role`                      | 회원 권한 변경          |
| PATCH  | `/api/admin/users/{userId}/withdraw`                  | 회원 탈퇴 처리          |
| GET    | `/api/admin/invitations`                              | 청첩장 목록 조회        |
| GET    | `/api/admin/invitations/{invitationId}`               | 청첩장 상세 조회        |
| GET    | `/api/admin/templates`                                | 관리자 템플릿 목록 조회 |
| GET    | `/api/admin/templates/{templateId}`                   | 관리자 템플릿 상세 조회 |
| POST   | `/api/admin/templates`                                | 템플릿 등록             |
| PATCH  | `/api/admin/templates/{templateId}`                   | 템플릿 수정             |
| DELETE | `/api/admin/templates/{templateId}`                   | 템플릿 삭제             |
| POST   | `/api/admin/templates/{templateId}/master-invitation` | 마스터 청첩장 연결      |
| GET    | `/api/admin/bgms`                                     | 관리자 BGM 목록 조회    |
| POST   | `/api/admin/bgms`                                     | BGM 등록                |
| PATCH  | `/api/admin/bgms/{bgmId}`                             | BGM 수정                |
| DELETE | `/api/admin/bgms/{bgmId}`                             | BGM 삭제                |

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

## 빌드 방법

### Backend

```bash
cd backend
./gradlew build
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

<br />

## Docker 실행

### 개발용 MySQL / Redis

```bash
docker compose up -d
```

### 운영 배포용

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

<br />

## 환경 변수

### Frontend

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_KAKAO_APP_KEY=
NEXT_PUBLIC_KAKAO_REST_API_KEY=
NEXT_PUBLIC_KAKAO_REDIRECT_URI=
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

### Backend

```env
JWT_SECRET=
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
SPRING_DATA_REDIS_HOST=
SPRING_DATA_REDIS_PORT=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

KAKAO_CLIENT_ID=
KAKAO_REDIRECT_URI=

GEMINI_API_KEY=
```

<br />

## 구현하며 고려한 점

- JWT 기반 인증 구조를 적용해 로그인 상태를 유지할 수 있도록 구성했습니다.
- Access Token과 Refresh Token을 분리해 토큰 재발급 흐름을 설계했습니다.
- 비밀번호는 평문으로 저장하지 않고 암호화하여 저장하도록 구성했습니다.
- 카카오 로그인을 통해 소셜 인증 흐름을 지원하도록 구성했습니다.
- 프론트엔드에서는 Zustand를 활용해 인증 상태를 전역에서 관리할 수 있도록 했습니다.
- 청첩장 제작 화면은 기본 정보, 예식 정보, 갤러리, 계좌, 지도, BGM, 섹션 설정 등 기능 단위로 컴포넌트를 분리했습니다.
- 공개 청첩장 화면은 섹션 렌더러 구조로 구성해 섹션 노출 여부와 순서 변경에 대응할 수 있도록 했습니다.
- 하객 기능은 공개 API로 분리해 로그인 없이 RSVP, 방명록, 게스트 사진 등록이 가능하도록 구성했습니다.
- 파일 업로드는 S3와 연동해 이미지 저장 및 삭제 흐름을 처리했습니다.
- 관리자 기능은 일반 사용자 기능과 분리해 회원, 템플릿, 청첩장, BGM을 관리할 수 있도록 구성했습니다.
- 신혼여행 플래너는 Gemini API를 활용해 사용자 조건 기반 여행 일정을 생성하고, 채팅을 통해 일정을 보완할 수 있도록 구성했습니다.
- 운영 환경에서는 Nginx가 프론트엔드와 백엔드 요청을 분기하고, 백엔드는 RDS MySQL, Redis, S3와 연동되도록 구성했습니다.
