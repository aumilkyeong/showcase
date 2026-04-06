# UI Kit — FE 컴포넌트 라이브러리 쇼케이스 설계

## 개요

FE 컴포넌트 설계 역량을 보여주기 위한 웹앱. 직접 구현한 UI 컴포넌트들을 인터랙티브 데모와 API 문서로 제공하는 자체 데모 사이트.

### 목표

- autocomplete, dropdown-menu, image-carousel, modal-dialog 4개 컴포넌트를 직접 설계/구현
- autocomplete부터 시작하여 점진적으로 컴포넌트 추가
- WCAG 2.1 AA 수준의 접근성 준수
- 외부 UI 라이브러리 없이 모든 컴포넌트 직접 구현

---

## 1. 프로젝트 구조

모노레포 `apps/ui-kit/` 하위에 Vite + React 단일 앱으로 구성한다.

```
apps/ui-kit/
├── public/
├── src/
│   ├── components/
│   │   ├── autocomplete/
│   │   │   ├── Autocomplete.tsx
│   │   │   ├── Autocomplete.module.css
│   │   │   ├── Autocomplete.test.tsx
│   │   │   ├── useAutocomplete.ts
│   │   │   └── index.ts
│   │   └── ... (dropdown-menu, image-carousel, modal-dialog 동일 패턴)
│   ├── hooks/                            ← 공용 훅 (useClickOutside, useFocusTrap 등)
│   ├── pages/
│   │   ├── HomePage.tsx                  ← 컴포넌트 카드 목록
│   │   └── autocomplete/
│   │       └── AutocompletePage.tsx
│   ├── layouts/
│   │   └── DocsLayout.tsx                ← 사이드바 + 콘텐츠 영역
│   ├── App.tsx
│   └── main.tsx
├── e2e/
│   └── autocomplete.spec.ts
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 핵심 원칙

- **로직 훅 분리** — 컴포넌트마다 `useXxx` 훅으로 상태/로직을 분리하여 테스트성과 재사용성 확보
- **동일한 디렉토리 패턴** — 새 컴포넌트 추가 시 디렉토리 복사 수준으로 간편
- **공용 훅** — `useClickOutside`, `useFocusTrap` 등은 `hooks/`에 별도 관리

---

## 2. 데모 사이트 구조

### 라우팅 (React Router)

```
/                          → HomePage (컴포넌트 카드 목록)
/components/autocomplete   → AutocompletePage
/components/dropdown-menu  → DropdownMenuPage
/components/image-carousel → ImageCarouselPage
/components/modal-dialog   → ModalDialogPage
```

### DocsLayout 구성

- **좌측 사이드바** — 컴포넌트 목록 네비게이션, 현재 페이지 하이라이트
- **메인 콘텐츠** — 3개 섹션:
  1. **Live Demo** — 인터랙티브 데모, props 조절 컨트롤 패널
  2. **API Reference** — Props 테이블 (이름, 타입, 기본값, 설명)
  3. **Accessibility** — 키보드 내비게이션, ARIA 속성 설명

### 컴포넌트 추가 흐름

1. `components/` 하위에 컴포넌트 디렉토리 생성
2. `pages/` 하위에 데모 페이지 생성
3. 라우트 배열에 항목 추가 — 사이드바는 이 배열을 기반으로 자동 렌더링

---

## 3. Autocomplete 컴포넌트 설계

첫 번째 구현 컴포넌트이자, 나머지 컴포넌트의 설계 패턴을 확립하는 기준.

### 컴포넌트 API (Props)

```tsx
interface AutocompleteProps<T> {
  // 필수
  items: T[];
  getItemLabel: (item: T) => string;

  // 선택
  onInputChange?: (value: string) => void;
  onSelect?: (item: T) => void;
  renderItem?: (item: T, highlighted: boolean) => ReactNode;
  placeholder?: string;
  maxResults?: number;        // 기본값 10
  debounceMs?: number;        // 기본값 300
  noResultsMessage?: string;  // 기본값 "결과 없음"
  loading?: boolean;
  disabled?: boolean;
}
```

### 로직 훅 (useAutocomplete)

분리 관리할 상태/로직:

- **inputValue** — 현재 입력 문자열
- **isOpen** — 드롭다운 열림/닫힘
- **highlightedIndex** — 키보드로 하이라이트된 아이템 인덱스
- **filteredItems** — 기본 내장 필터링 (외부 `onInputChange` 없을 때)
- 키보드 핸들러 (ArrowUp/Down, Enter, Escape)
- 클릭 외부 감지 → 닫기

### 접근성 (WCAG 2.1 AA)

- `role="combobox"` + `aria-expanded`, `aria-activedescendant`, `aria-autocomplete="list"`
- 결과 목록: `role="listbox"`, 각 아이템: `role="option"` + `aria-selected`
- 키보드: ArrowUp/Down (이동), Enter (선택), Escape (닫기)
- 포커스 관리: 선택 후 입력 필드로 포커스 복귀
- 스크린 리더: 결과 수 변경 시 `aria-live="polite"` 영역으로 안내

### 데모 페이지 시나리오

- **기본 사용** — 로컬 문자열 배열 필터링
- **비동기 검색** — `onInputChange`로 API 호출 시뮬레이션 (loading 상태 포함)
- **커스텀 렌더링** — `renderItem`으로 아이콘 + 텍스트 조합

---

## 4. 테스트 전략

### 유닛 테스트 (Vitest + React Testing Library)

**컴포넌트별 테스트 범위:**

- 렌더링 — props에 따른 올바른 렌더링
- 인터랙션 — 입력, 선택, 열기/닫기
- 키보드 — ArrowUp/Down, Enter, Escape 동작
- 접근성 — ARIA 속성 올바르게 설정되는지
- 엣지 케이스 — 빈 결과, disabled 상태, 긴 텍스트

**훅 테스트:**

- `useAutocomplete` — `renderHook`으로 독립 테스트
- 공용 훅 (`useClickOutside`, `useFocusTrap`) — 각각 독립 테스트

### E2E 테스트 (Playwright)

**컴포넌트별 시나리오:**

- 데모 페이지 접속 → 인터랙션 → 기대 결과 확인
- 키보드만으로 전체 플로우 완료 가능한지 검증
- `@axe-core/playwright`로 자동 a11y 감사

**실행 구조:**

```
e2e/
  autocomplete.spec.ts
  dropdown-menu.spec.ts
  ...
```

---

## 5. 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | React + TypeScript |
| 빌드 | Vite |
| 스타일링 | CSS Modules |
| 라우팅 | React Router |
| 유닛 테스트 | Vitest + React Testing Library |
| E2E 테스트 | Playwright |
| 접근성 검증 | @axe-core/playwright |
| 린트/포맷 | @showcase/eslint-config, @showcase/prettier-config |
| TS 설정 | @showcase/typescript-config |

### 의존성 원칙

- 외부 UI 라이브러리 사용 안 함 — 모든 컴포넌트 직접 구현
- 유틸리티 라이브러리 최소화 — React Router 정도만 외부 의존
