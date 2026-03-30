# OmniCRM — Omnichannel Customer Relationship Management

A production-grade omnichannel CRM platform built with **Next.js 15 (App Router)**. Manage customers across WhatsApp, Facebook, Instagram, TikTok, SMS, and VoIP — all from a single unified interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [User Roles & Portals](#user-roles--portals)
- [Key Libraries & Why They Are Used](#key-libraries--why-they-are-used)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
- [CI/CD & Deployment](#cicd--deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Customer & Lead Management
- Full customer profiles with contact details, tags, notes, and communication history
- Lead pipeline with conversion to customer workflows
- Customer segmentation and tagging
- Export functionality (CSV/Excel)

### Multi-Channel Messaging
- Unified inbox for WhatsApp, Facebook, Instagram, TikTok, and SMS
- Message archiving, search, and filtering
- AI-powered response suggestions
- Agent assignment and message routing

### Task Management
- Kanban board and table-view task tracking
- Priority levels, due dates, and agent assignments
- Cross-team collaboration with real-time updates

### Call Center (VoIP)
- Integrated SIP/VoIP calling via JsSIP
- Incoming/outgoing call management
- Call session tracking and history

### Real-Time Notifications
- WebSocket-powered live notifications
- In-app toast alerts with sound
- Cross-tab synchronization

### Analytics & Reporting
- Dashboard with KPIs and business metrics
- Team productivity reports
- Per-channel message analytics

### Authentication & Access Control
- JWT-based authentication (access + refresh token flow)
- Role-based access control (Super Admin, Admin, Agent, User)
- Invitation-based team onboarding
- Multi-tenant architecture with company-scoped data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.0.2 (App Router) |
| Language | JavaScript / React 18.3 |
| Styling | Tailwind CSS 3.4 |
| State Management | React Context API |
| HTTP Client | Axios 1.7 with interceptors |
| Real-time | Native WebSockets (WSS) |
| VoIP | JsSIP 3.10 (SIP protocol) |
| Charts | Chart.js 4, Recharts 3, react-chartjs-2 |
| Forms | react-select, react-phone-input-2 |
| Date Handling | date-fns 4, Moment.js 2.30 |
| Notifications | React Toastify 10 |
| Icons | Lucide React, React Icons, FontAwesome 6, Bootstrap Icons |
| Payments | react-paystack |
| Error Tracking | Sentry (@sentry/nextjs 10) |
| Progress Indicator | NProgress |
| Markdown | react-markdown + remark-gfm |

---

## Prerequisites

Before running this project, ensure you have the following installed:

### Required

| Tool | Version | Install |
|---|---|---|
| **Node.js** | v22.x (recommended), v18.x minimum | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (bundled with Node.js) | Included with Node.js |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com) |

### Required Access

| Resource | Description |
|---|---|
| **Backend API** | The frontend is a pure client — it requires a running OmniCRM backend server |
| **WebSocket Server** | Real-time notifications and calls depend on a live WSS endpoint |
| **Sentry Account** | For error tracking (optional in development) |

### Verify your setup

```bash
node --version    # Should print v18.x or v22.x
npm --version     # Should print v9.x or higher
git --version     # Should print any version
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Tech4mation/omnicrm-frontend.git
cd omnicrm-frontend
```

### 2. Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`. Expect ~500MB in `node_modules/`.

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local   # if .env.example exists
# or create it manually:
touch .env.local
```

Then populate it with your values (see [Environment Variables](#environment-variables) below).

### 4. Start the development server

```bash
npm run dev
```

The application will be available at **[http://localhost:3001](http://localhost:3001)**.

> Note: This project runs on port **3001**, not the default Next.js port of 3000.

### 5. Sign in

Navigate to `http://localhost:3001/auth/sign-in` and log in with your credentials.
On successful login, you will be redirected to the appropriate portal based on your role:
- `/nativecrm/dashboard` for Agents and Users
- `/admin/dashboard` for Admins

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ─── Backend API ──────────────────────────────────────────────────────────────
# Full URL of the backend REST API (must include /api suffix)
NEXT_PUBLIC_API_URL=https://dev-core.nativetalkcrm.com/api

# ─── WebSocket ────────────────────────────────────────────────────────────────
# Hostname only (no protocol prefix) — the app prepends wss:// automatically
NEXT_PUBLIC_WS_BASE_URL=dev-core.nativetalkcrm.com

# ─── Multi-Tenancy ────────────────────────────────────────────────────────────
# Fixed domain identifier sent as a header on every API request
NEXT_PUBLIC_USER_DOMAIN=join

# ─── Error Tracking (optional in development) ─────────────────────────────────
# Sentry auth token for source map uploads during build
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

### Variable Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend REST API. All Axios requests are made relative to this. |
| `NEXT_PUBLIC_WS_BASE_URL` | Yes | Hostname for WebSocket connections. Used for notifications (`/ws/notifications/`) and VoIP. |
| `NEXT_PUBLIC_USER_DOMAIN` | Yes | Multi-tenancy domain header value. Set to `join` unless told otherwise. |
| `SENTRY_AUTH_TOKEN` | No | Sentry token for uploading source maps. Can be omitted during local development. |

> Variables prefixed with `NEXT_PUBLIC_` are embedded into the browser bundle. Never put secrets in them.

---

## Project Structure

```
omnicrm-frontend/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # PR checks: lint + build validation
│       ├── deploy-prod.yml         # Auto-deploy to production on push to main
│       └── deploy-staging.yml      # Auto-deploy to staging on push to dev
├── .gitlab-ci.yml                  # GitLab CI/CD mirror pipeline
├── public/                         # Static assets (images, icons, sounds)
├── src/
│   ├── app/                        # Next.js 15 App Router root
│   │   ├── layout.js               # Root layout — global providers
│   │   ├── page.js                 # Root page — auth-based redirect
│   │   ├── globals.css             # Global CSS
│   │   │
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── create-password/
│   │   │   ├── custom-url/
│   │   │   ├── verify-otp/
│   │   │   ├── pricing/
│   │   │   ├── success/
│   │   │   ├── password-reset/
│   │   │   └── invitation/accept/[id]/
│   │   │
│   │   ├── nativecrm/              # Agent / User portal
│   │   │   ├── layout.js           # Portal layout (sidebar + navbar)
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   │   └── [id]/           # Dynamic customer detail page
│   │   │   ├── messages/
│   │   │   ├── leads/
│   │   │   ├── tasks/
│   │   │   ├── tickets/
│   │   │   ├── call-center/
│   │   │   ├── sms/
│   │   │   ├── notifications/
│   │   │   ├── support/
│   │   │   ├── profile/
│   │   │   └── users/
│   │   │
│   │   ├── admin/                  # Admin portal
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── leads/
│   │   │   ├── messages/
│   │   │   ├── tasks/
│   │   │   ├── tickets/
│   │   │   ├── users/
│   │   │   ├── call-center/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   ├── team-productivity/
│   │   │   ├── profile/
│   │   │   └── support/
│   │   │
│   │   ├── superadmin/             # Super Admin portal
│   │   │
│   │   ├── legal/                  # Terms, Privacy Policy
│   │   ├── unauthorized/           # 403 page
│   │   │
│   │   ├── api/
│   │   │   └── sentry-example-api/ # Sentry test endpoint
│   │   │
│   │   └── components/             # Shared React components
│   │       ├── Message/            # Chat UI (list, header, input, modals)
│   │       ├── Task/               # Kanban & table board
│   │       ├── Customers/          # Customer list & profile cards
│   │       ├── Leads/              # Lead management UI
│   │       ├── Users/              # User management UI
│   │       ├── Dashboard/          # Metric widgets
│   │       ├── Sidebar/            # Navigation sidebar
│   │       ├── Navbar/             # Top navigation bar
│   │       ├── Notification/       # Notification center panel
│   │       ├── CallCenter/         # VoIP call modal
│   │       ├── Pagination/         # Reusable paginator
│   │       ├── Profile/            # Profile page components
│   │       ├── MainContainer/      # Shared layout wrapper
│   │       ├── Sms/                # SMS interface
│   │       ├── Ticket/             # Support ticket UI
│   │       └── admin/              # Admin-specific components
│   │
│   ├── context/                    # Global state via React Context
│   │   ├── AuthContext.js          # User auth, login/logout, company data
│   │   ├── NotificationContext.js  # Real-time WebSocket notifications
│   │   ├── CallContext.js          # JsSIP VoIP call sessions
│   │   ├── ErrorContext.js         # Centralized API error handling
│   │   └── PermissionsContext.js   # Role-based permission checks
│   │
│   ├── services/
│   │   └── axiosConfig.js          # Axios instance, interceptors, token refresh
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── usePortalRouter.js
│   │   ├── useChatList.js
│   │   ├── useWebsocket.js
│   │   └── useCustomAlert.js
│   │
│   └── utils/                      # Pure utility functions
│       ├── userUtils.js            # getUserFromStorage, getUserDomain
│       ├── maskContactInfo.js      # Mask sensitive contact info
│       ├── normalizePhone.js       # Phone number normalization
│       ├── timeUtils.js            # Date/time formatting
│       ├── portalUtils.js          # Portal routing helpers
│       └── failedMessagesStore.js  # Retry queue for failed messages
│
├── next.config.mjs                 # Next.js config (images, redirects, Sentry, Webpack)
├── tailwind.config.js              # Tailwind config (dark mode, content paths)
├── jsconfig.json                   # Path aliases: @/* → ./src/*
├── postcss.config.mjs              # PostCSS config
├── .eslintrc.json                  # ESLint rules
├── sentry.client.config.js         # Sentry browser config
├── sentry.server.config.js         # Sentry server config
├── sentry.edge.config.js           # Sentry edge runtime config
├── package.json
└── package-lock.json
```

---

## User Roles & Portals

The application has three distinct portals, each with its own URL namespace:

| Role | Portal URL | Description |
|---|---|---|
| **Agent / User** | `/nativecrm/*` | Day-to-day CRM work: messages, customers, tasks, calls |
| **Admin** | `/admin/*` | Full management: users, settings, reports, analytics |
| **Super Admin** | `/superadmin/*` | System-wide administration |

Authentication flow:
1. All unauthenticated routes redirect to `/auth/sign-in`
2. On login, the root page (`/`) reads the user's role and redirects to the appropriate portal
3. JWT access + refresh tokens are stored in `localStorage` under the `user` key
4. Refresh tokens are automatically used on 401 responses — no manual re-login needed

---

## Key Libraries & Why They Are Used

### Core

| Library | Version | Purpose |
|---|---|---|
| `next` | 15.0.2 | Full-stack React framework — App Router, file-based routing, SSR/SSG |
| `react` / `react-dom` | 18.3.1 | UI rendering, concurrent features |
| `axios` | 1.7.7 | HTTP client with request/response interceptors, token refresh queue |
| `tailwindcss` | 3.4.1 | Utility-first CSS — responsive design, dark mode |

### Real-Time & Communication

| Library | Version | Purpose |
|---|---|---|
| `jssip` | 3.10.1 | SIP/VoIP protocol for in-browser phone calls |
| `ws` | 8.18.0 | WebSocket support (server-side/Node.js contexts) |

### UI & UX

| Library | Version | Purpose |
|---|---|---|
| `lucide-react` | 0.475.0 | Clean icon set |
| `react-icons` | 5.3.0 | Extended icon library (FlatIcons, etc.) |
| `@fortawesome/fontawesome-svg-core` | 6.x | FontAwesome SVG icons |
| `bootstrap-icons` | 1.11.3 | Bootstrap icon CSS pack |
| `react-toastify` | 10.0.6 | Toast notification popups |
| `react-tooltip` | 5.28.0 | Accessible tooltip components |
| `emoji-picker-react` | 4.18.0 | Emoji picker for message input |
| `nprogress` | 0.2.0 | Slim loading progress bar on navigation |

### Data & Forms

| Library | Version | Purpose |
|---|---|---|
| `react-select` | 5.10.0 | Accessible, searchable dropdown selects |
| `react-phone-input-2` | 2.15.1 | International phone number input with flag |
| `react-date-range` | 2.0.1 | Date range picker for filters and reports |
| `date-fns` | 4.1.0 | Modern, modular date utility functions |
| `moment` | 2.30.1 | Legacy date formatting (used in some components) |
| `use-debounce` | 10.0.4 | Debounce hook for search inputs |
| `copy-to-clipboard` | 3.3.3 | Clipboard copy utility |

### Charts & Analytics

| Library | Version | Purpose |
|---|---|---|
| `chart.js` | 4.4.7 | Canvas-based charting engine |
| `react-chartjs-2` | 5.3.0 | React wrapper for Chart.js |
| `recharts` | 3.8.0 | Declarative, SVG-based charts |

### Payments

| Library | Version | Purpose |
|---|---|---|
| `react-paystack` | 6.0.0 | Paystack payment gateway integration (pricing/subscription flow) |

### Content

| Library | Version | Purpose |
|---|---|---|
| `react-markdown` | 10.1.0 | Render markdown content in chat/notes |
| `remark-gfm` | 4.0.1 | GitHub Flavored Markdown plugin (tables, strikethrough, etc.) |

### Monitoring

| Library | Version | Purpose |
|---|---|---|
| `@sentry/nextjs` | 10.38.0 | Error tracking, performance monitoring, source maps |

---

## Available Scripts

Run all scripts from the project root with `npm run <script>`:

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev -p 3001` | Start development server on **port 3001** with hot reload |
| `build` | `next build` | Create an optimized production build in `.next/` |
| `start` | `next start -p 3001` | Start the production server (requires a prior `build`) |
| `lint` | `next lint` | Run ESLint across the project |

### Full development workflow

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Lint before committing
npm run lint

# Build for production
npm run build

# Preview the production build locally
npm start
```

---

## Architecture Overview

### Authentication Flow

```
User visits /
  └─> AuthContext checks localStorage for valid JWT
        ├─> Not authenticated → redirect to /auth/sign-in
        └─> Authenticated → check role → redirect to portal
```

### API Layer (`src/services/axiosConfig.js`)

Every HTTP request passes through a single Axios instance that:
1. Attaches `Authorization: Bearer <access_token>` header
2. Attaches `User-Domain: join` header (multi-tenancy)
3. On **401 response**: pauses all queued requests, calls `/auth/token/refresh/`, retries
4. On refresh failure: calls `logout()` and redirects to sign-in
5. Shows/hides the NProgress loading bar on request start/end

### State Management (Context API)

| Context | File | Manages |
|---|---|---|
| `AuthContext` | `context/AuthContext.js` | User session, company data, login/logout |
| `NotificationContext` | `context/NotificationContext.js` | WebSocket notifications, unread count |
| `CallContext` | `context/CallContext.js` | JsSIP sessions, incoming/outgoing calls |
| `ErrorContext` | `context/ErrorContext.js` | Centralized API error display |
| `PermissionsContext` | `context/PermissionsContext.js` | RBAC permission checking |

All contexts are mounted in the root layout (`src/app/layout.js`) so they are globally available.

### Real-Time Communication

- **Notifications:** A persistent WebSocket connection to `wss://${NEXT_PUBLIC_WS_BASE_URL}/ws/notifications/?uuid=${company.id}` delivers live events. Auto-reconnects after 3 seconds on disconnect.
- **VoIP Calls:** JsSIP registers a SIP User Agent via WebSocket. Incoming calls trigger the `CallModal` component. Outgoing calls can be initiated from the Call Center page.

### Routing & Redirects

Next.js redirects are configured in `next.config.mjs`:
- `/nativecrm` → `/nativecrm/dashboard`
- `/admin` → `/admin/dashboard`

Path aliases in `jsconfig.json`:
- `@/*` → `./src/*`
- `@/public/*` → `./public/*`

---

## CI/CD & Deployment

### Branch Strategy

| Branch | Environment | Auto-Deploy |
|---|---|---|
| `main` | Production | Yes — on every push |
| `dev` | Staging | Yes — on every push |
| `preview` | Preview | CI checks only |
| `feature/*` | Local only | No |

### GitHub Actions Workflows

**`ci.yml`** — runs on every PR targeting `main`, `dev`, or `preview`:
1. Checks out code on Node.js 22.x
2. Installs dependencies
3. Runs ESLint (non-blocking)
4. Builds the project with test environment variables
5. Verifies `.next/` output exists

**`deploy-staging.yml`** — runs on push to `dev`:
1. Builds with staging environment variables
2. SCPs build artifacts to staging server (`72.61.18.174`)
3. Restarts `omnicrm-frontend-staging.service` via SSH

**`deploy-prod.yml`** — runs on push to `main`:
1. Builds with production environment variables
2. SCPs build artifacts to production server (`92.113.26.141`)
3. Restarts `omnicrm-frontend.service` via SSH
4. Uploads source maps to Sentry

### Required GitHub Secrets

| Secret | Used By | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | All deploy workflows | Backend API base URL per environment |
| `NEXT_PUBLIC_WS_BASE_URL` | All deploy workflows | WebSocket hostname per environment |
| `NEXT_PUBLIC_USER_DOMAIN` | All deploy workflows | Multi-tenancy domain value |
| `SENTRY_AUTH_TOKEN` | Production deploy | Sentry source map upload |
| `DEPLOY_SSH_KEY` | All deploy workflows | SSH private key for server access |

### Production Build

```bash
# Build
npm run build

# Start (in production, managed by systemd)
npm start
```

The build outputs to `.next/`. The systemd service on the server runs `npm start` to serve the application.

---

## Contributing

### Workflow

1. Branch off `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally:
   ```bash
   npm run dev
   npm run lint
   ```

3. Push and open a PR targeting `dev`:
   ```bash
   git push origin feature/your-feature-name
   ```

4. After review and approval, changes merge to `dev` (staging auto-deploys)
5. Staging is verified, then a PR from `dev` → `main` triggers production deploy

### Code Style

- ESLint rules are defined in `.eslintrc.json` (extends `next/core-web-vitals`)
- Tailwind CSS for all styling — avoid inline styles
- Use the `@/` path alias for all internal imports
- React Context for shared state — no Redux or Zustand

### Bug Reports

Open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Node.js version and OS

---

## License

This project is proprietary software. All rights reserved.
Developed and maintained by **Tech4mation**.

---

## Support

For support and questions, contact the development team or open an issue in the repository.