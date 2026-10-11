# Bido frontend (Angular)

Angular 22, standalone components, signals, zoneless, SSR (`@angular/ssr`), Tailwind CSS v4, pnpm.

## Folder structure (`src/app/`)

| Folder | Contents | May import from |
|---|---|---|
| `api/<service>/` | Generated Swagger clients and models (`generated/`, never hand-edit) plus thin wrappers. One folder per microservice: `auth`, `profile`, `menu`, `bidding`. | `core` |
| `domain/<service>/` | Per-service stores, facades, guards and interceptors. No UI. | `api`, `core`, `shared` |
| `features/<area>/` | UI screens by user area: `onboarding`, `client`, `supplier`, `admin`, `public`. Use `pages/` for routed screens and `components/` for feature-only pieces. | `domain`, `shared`, `core` |
| `shared/ui`, `shared/layout`, `shared/utils` | App-wide reusable components (prefix `bido-`), layout pieces, helpers. | `core` |
| `core/` | App config, environment, routing setup. | nothing in the app |

Rules are enforced by `eslint-plugin-boundaries` (see `eslint.config.js`). Features never import other features. Components never import `api/` directly; they go through a `domain/` store.

Path aliases: `@api/*`, `@core/*`, `@domain/*`, `@features/*`, `@shared/*`.

## Conventions

- Selector prefix is `bido` (`bido-button`, `bido-home-page`); one component per file.
- File names say what they are: `home.page.ts` for routed pages, `request-card.ts` for components, `requests.store.ts` for stores, `auth.guard.ts`, `auth.interceptor.ts`.
- Use `inject()`, signals, `@if`/`@for`, `input()`/`output()`, `ChangeDetectionStrategy.OnPush`.
- Style with Tailwind utilities; shared design tokens live in `src/styles.css` under `@theme`.
- Use `@angular/cdk` for overlays, dialogs and accessibility behavior.

## Commands

- `pnpm start` dev server, `pnpm build`, `pnpm lint`, `pnpm test --watch=false`.
