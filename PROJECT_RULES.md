# 📝 프로젝트 규칙 및 아키텍처 가이드

### Ⅰ. 개요

- **프로젝트명**: 피드백 수집 및 관리 플랫폼
- **기술 스택**: Next.js (Frontend), NestJS (Backend), Prisma (ORM), PostgreSQL (DB)
- **핵심 목표**: Next.js + NestJS + Prisma 기반의 풀스택 웹 서비스를 개발하고, 최종적으로 Amazon Web Services(AWS)에 배포하는 것을 목표로 한다.

### Ⅱ. 공통 원칙

1.  **엄격한 네이밍 규칙**: 각 파일과 컴포넌트, 변수, 함수는 역할을 명확히 알 수 있도록 일관된 규칙에 따라命名한다.
2.  **계층적 아키텍처 준수**: 백엔드는 DDD, 프론트엔드는 기능별 모듈화를 엄격히 따른다.
3.  **컴포넌트 기반 UI**: 재사용 가능한 컴포넌트를 적극적으로 활용하며, 브라우저의 네이티브 `alert`, `confirm` 사용을 금지한다.
4.  **타입 분리**: 프론트엔드와 백엔드 모두, 여러 곳에서 사용되는 타입 정의는 `types/` 디렉토리에서 중앙 관리한다.

---

### Ⅲ. 백엔드 (`back_feedback`)

#### 1. 아키텍처

- **DDD (Domain-Driven Design)** 와 **TDD (Test-Driven Development)** 를 핵심 아키텍처로 채택한다.
- 각 도메인 모듈(e.g., `user`, `feedback`)은 아래의 4가지 계층으로 명확히 분리한다.

#### 2. 디렉토리 구조 (모듈 내부)

- `application/`: **서비스(Service)** 계층. 실제 비즈니스 로직과 흐름을 담당한다.
- `domain/`: **도메인(Domain)** 계층. 핵심 `Entity`와 `Repository` 인터페이스를 정의한다.
- `infrastructure/`: **인프라(Infrastructure)** 계층. `Prisma` 등 외부 시스템과의 연동을 담당하며, `Repository` 인터페이스의 실제 구현체(`*.prisma.repository.ts`)를 둔다.
- `interface/`: **인터페이스(Interface)** 계층. 외부 요청의 진입점으로, `Controller`와 DTO(Data Transfer Object)를 정의한다.

#### 3. 타입 및 DTO 관리

- 여러 모듈에서 공용으로 사용되거나, API 명세와 직결되는 타입 및 DTO는 최상위 `src/types/` 디렉토리에서 관리한다.
- 예: `src/types/feedback.type.ts`, `src/types/user.type.ts`

---

### Ⅳ. 프론트엔드 (`front_feedback`)

#### 1. API 통신

- **`src/api/index.ts`**: Axios 인스턴스를 설정하고 관리한다.
  - `axiosInstance` (Private): 인증이 필요한 요청에 사용. JWT 토큰을 자동으로 헤더에 추가하고, 401 오류 시 토큰 재발급을 시도하는 인터셉터를 포함한다.
  - `axiosPublicInstance` (Public): 인증이 필요 없는 공개 API 요청에 사용된다.
- **`src/services/*.ts`**: 각 도메인별 API 호출 함수를 모아놓은 서비스 계층이다. (e.g., `feedbackService.ts`)

#### 2. 인증 및 라우팅

- **`src/middleware.ts`**: 전역 라우트 보호를 담당한다.
  - 공개 경로(`publicPaths`)와 시스템 경로(`/_next`, `/api`)를 제외한 모든 요청을 가로챈다.
  - Access Token이 없을 경우, Refresh Token을 사용하여 자동 토큰 갱신을 시도한다.

#### 3. 컴포넌트 및 UI 정책

- **`src/components/`**: 재사용 가능한 UI 컴포넌트를 위치시킨다.
  - `Button.tsx`, `Modal.tsx`, `Toast.tsx` 등이 이에 해당한다.
- **`alert()` 금지 → `Toast` 컴포넌트 사용**: 사용자에게 간단한 정보/성공/실패 메시지를 전달할 때는 반드시 직접 구현한 `Toast` 컴포넌트를 `useToast()` 훅으로 호출한다.
- **`confirm()` 금지 → `Modal` 컴포넌트 사용**: 사용자에게 확인/취소가 필요한 액션을 요구할 때는 반드시 `Modal` 컴포넌트를 사용한다.

#### 4. 상태 관리 및 훅

- **`src/hooks/`**: `useToast`와 같이 재사용 가능한 로직을 커스텀 훅으로 분리하여 관리한다.
- **`src/store/`**: `Zustand`, `Context API` 등 전역으로 관리되어야 할 상태 로직을 둔다. (e.g., `auth.ts`)
