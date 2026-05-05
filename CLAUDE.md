# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server on port 3001 (not 3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
```

No test suite is configured.

## Architecture

Next.js 15 App Router, JavaScript (not TypeScript), Tailwind CSS. Three separate portals share components but have distinct layouts and auth guards:

- `/nativecrm/*` — Agent/user portal
- `/admin/*` — Admin portal
- `/superadmin/*` — Super admin portal

The root page (`src/app/page.jsx`) reads the user role from localStorage and redirects to the appropriate portal. `src/app/components/ProtectedRoute.jsx` enforces access by role.

Path alias: `@/*` → `./src/*`.

## State Management

React Context API only — no Redux or Zustand. Five global contexts mounted in `src/app/layout.jsx`:

| Context | Responsibility |
|---|---|
| `AuthContext` | Session, tokens, login/logout, company data |
| `NotificationContext` | WebSocket-based real-time notifications |
| `CallContext` | JsSIP VoIP sessions (call center) |
| `ErrorContext` | Centralized API error display |
| `PermissionsContext` | Role-based permission checks (`usePermissions()`) |

User session is persisted in localStorage under the `user` key as JSON (`{ access, refresh, user_id, role, ... }`).

## API Layer

All HTTP calls go through the custom `useApi()` hook from `src/services/axiosConfig.js`. Key behaviours baked into the interceptors:

- Attaches `Authorization: Bearer <access_token>` and `User-Domain: <domain>` (multi-tenancy) to every request
- On 401: queues in-flight requests, silently refreshes via `/auth/token/refresh/`, then retries the queue
- On refresh failure: logs out and redirects to sign-in
- Shows/hides NProgress loading bar on request lifecycle

Base URL is `NEXT_PUBLIC_API_URL`. WebSocket base is `NEXT_PUBLIC_WS_BASE_URL`.

## Real-time

WebSocket connection is managed by `src/context/useWebsocket.js`. It connects to `wss://${NEXT_PUBLIC_WS_BASE_URL}/ws/notifications/?agent_uuid=${user.user_id}` and auto-reconnects after 3 seconds on disconnect.

VoIP (call center) uses JsSIP (`src/context/CallContext.jsx`).

## Environment Variables

```env
NEXT_PUBLIC_USER_DOMAIN=    # Multi-tenant company domain
NEXT_PUBLIC_API_URL=        # Backend API base (e.g. http://localhost:8001/api)
NEXT_PUBLIC_WS_BASE_URL=    # WebSocket host (e.g. localhost:8002)
SENTRY_AUTH_TOKEN=          # Optional — error tracking
```

## ESLint Overrides

These rules are intentionally disabled project-wide — do not re-enable them:
- `react-hooks/exhaustive-deps`
- `@next/next/no-img-element`
- `react/jsx-key`
- `react/no-unescaped-entities`


## Task Planning Convention

Before implementing any new feature, bug fixes not related to conversation or significant change:
1. Draft Jira ticket(s) — one per affected project — with:
   - Title
   - Task type (Story / Task / Bug / Spike)
   - Description with context and acceptance criteria
   - Story points out of 10
2. Wait for explicit confirmation before writing any code.
