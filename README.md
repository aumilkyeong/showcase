# Showcase

Frontend UI 컴포넌트를 직접 설계하고 구현하는 인터랙티브 포트폴리오 프로젝트입니다. 각 컴포넌트의 라이브 데모, API 문서, 접근성 가이드를 제공합니다.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Language | TypeScript 6 |
| UI | React 19 |
| Build | Vite 6 |
| Styling | CSS Modules |
| Routing | React Router 7 |
| i18n | i18next + react-i18next |
| Unit Test | Vitest + React Testing Library |
| E2E Test | Playwright + axe-core |
| Lint / Format | ESLint 10 + Prettier |

## Project Structure

```
showcase/
├── apps/
│   └── ui-kit/                  # React 앱 (컴포넌트 데모 사이트)
├── packages/
│   ├── eslint-config/           # 공유 ESLint 설정
│   ├── prettier-config/         # 공유 Prettier 설정
│   └── typescript-config/       # 공유 TypeScript 설정
├── docs/                        # 설계 문서
├── pnpm-workspace.yaml
└── package.json
```

## Components

| Component | Description | Status |
|-----------|------------|--------|
| Autocomplete | 제네릭 콤보박스 - 로컬/비동기 필터링, 디바운스, 키보드 내비게이션, WAI-ARIA 컴플라이언스 | Done |
| Dropdown Menu | 합성 컴포넌트 패턴 기반 드롭다운 메뉴 - Relative/Portal 렌더링 전략, 키보드 내비게이션, WAI-ARIA Menu Button 패턴 | Done |
| Image Carousel | 이미지 캐러셀 - Flux 패턴 상태 관리, Intent 기반 3단계 프리로딩, Autoplay, 반응형 이미지(srcSet), WAI-ARIA Carousel 패턴 | Done |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.28.0

### Install

```bash
pnpm install
```

### Development

```bash
# 개발 서버 실행 (localhost:5173)
pnpm --filter @showcase/ui-kit dev
```

### Test

```bash
# 유닛 테스트
pnpm --filter @showcase/ui-kit test

# E2E 테스트
pnpm --filter @showcase/ui-kit test:e2e
```

### Build

```bash
pnpm --filter @showcase/ui-kit build
pnpm --filter @showcase/ui-kit preview
```

### Lint & Format

```bash
# 전체 워크스페이스
pnpm lint
pnpm format
pnpm format:check
```

## i18n

한국어(ko)와 영어(en)를 지원하며, URL 경로로 로케일을 결정합니다.

- `/:locale/components/autocomplete` - Autocomplete 데모 페이지
- `/:locale/components/dropdown-menu` - Dropdown Menu 데모 페이지
- `/:locale/components/image-carousel` - Image Carousel 데모 페이지

## License

Private
