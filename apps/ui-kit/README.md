# @showcase/ui-kit

FE 컴포넌트 설계 역량을 보여주기 위한 인터랙티브 데모 사이트.
외부 UI 라이브러리 없이 직접 구현한 컴포넌트를 라이브 데모, API 문서, 접근성 가이드와 함께 제공합니다.

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite 6 |
| 스타일링 | CSS Modules |
| 라우팅 | React Router 7 |
| 다국어 | i18next + react-i18next (한국어/영어) |
| 유닛 테스트 | Vitest + React Testing Library |
| E2E 테스트 | Playwright + @axe-core/playwright |
| 린트/포맷 | @showcase/eslint-config, @showcase/prettier-config |

## 컴포넌트

### Autocomplete

제네릭 타입(`<T>`)을 지원하는 combobox 컴포넌트.

- 로컬 필터링 + 디바운스 (기본 300ms)
- 비동기 데이터 로딩 (loading 상태)
- 커스텀 렌더링 (`renderItem`)
- 키보드 내비게이션 (ArrowUp/Down, Enter, Escape)
- WAI-ARIA Combobox 패턴 준수 (WCAG 2.1 AA)

### Dropdown Menu

합성 컴포넌트(Compound Component) 패턴 기반 드롭다운 메뉴.

- 합성 컴포넌트 패턴 (`DropdownMenu`, `.Button`, `.List`, `.Item`)
- React Context 기반 상태 공유 (prop drilling 없음)
- Relative / Portal 두 가지 렌더링 배치 전략
- 키보드 내비게이션 (ArrowUp/Down, Home/End, Enter, Space, Escape, Tab)
- disabled 아이템 자동 건너뜀 (순환 탐색)
- WAI-ARIA Menu Button 패턴 준수

## 프로젝트 구조

```
src/
├── components/
│   ├── autocomplete/          # Autocomplete 컴포넌트 + 훅 + 테스트
│   └── dropdown-menu/         # Dropdown Menu 합성 컴포넌트 + Context + 훅 + 테스트
├── hooks/                     # 공용 훅 (useDebounce, useClickOutside)
├── pages/
│   ├── autocomplete/          # Autocomplete 데모 페이지
│   └── dropdown-menu/         # Dropdown Menu 데모 페이지 (5-step 서사 구조)
├── layouts/                   # DocsLayout (사이드바), LocaleLayout (i18n 라우팅)
├── locales/{ko,en}/           # 번역 JSON 파일
├── routes.ts                  # 라우트 정의 (lazy import)
├── i18n.ts                    # i18next 초기화
└── main.tsx                   # 엔트리포인트
e2e/
├── autocomplete.spec.ts       # Autocomplete E2E 테스트
└── dropdown-menu.spec.ts      # Dropdown Menu E2E 테스트
```

## 시작하기

```bash
# 프로젝트 루트에서
pnpm install

# 개발 서버
pnpm --filter @showcase/ui-kit dev          # http://localhost:5173

# 빌드
pnpm --filter @showcase/ui-kit build

# 프로덕션 미리보기
pnpm --filter @showcase/ui-kit preview
```

`apps/ui-kit/` 디렉토리 안에서는 `pnpm dev`, `pnpm build` 등으로 직접 실행할 수도 있습니다.

## 테스트

```bash
# 유닛 테스트
pnpm --filter @showcase/ui-kit test              # 단일 실행
pnpm --filter @showcase/ui-kit test:watch        # 워치 모드

# E2E 테스트
pnpm --filter @showcase/ui-kit test:e2e
```

## 코드 품질

```bash
pnpm --filter @showcase/ui-kit lint              # ESLint 검사
pnpm --filter @showcase/ui-kit format:check      # Prettier 포맷 검사
pnpm --filter @showcase/ui-kit format            # 자동 포맷팅
```

## 라우팅

```
/                                     → /ko/components/autocomplete 리다이렉트
/:locale/components/autocomplete      → Autocomplete 데모 페이지
/:locale/components/dropdown-menu     → Dropdown Menu 데모 페이지
```

URL의 `:locale` 파라미터(`ko` 또는 `en`)로 언어가 결정되며, 사이드바의 `KO | EN` 토글로 전환할 수 있습니다.

## 컴포넌트 추가 방법

1. `src/components/<name>/` 디렉토리 생성 (컴포넌트 + 훅 + 테스트)
2. `src/pages/<name>/` 데모 페이지 생성
3. `src/locales/{ko,en}/<name>.json` 번역 파일 추가
4. `src/routes.ts`에 라우트 항목 추가 — 사이드바가 자동으로 반영됩니다
