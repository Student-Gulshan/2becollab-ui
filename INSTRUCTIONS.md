# 2BeCollab — Master Instructions

> **READ THIS FILE BEFORE EVERY CODING SESSION.**

---

## 1. Project Overview

**2BeCollab** is a two-sided marketplace connecting **Businesses (Brands)** with **Creators (Influencers)** for paid promotions, using an Upwork-style workflow:

```
Discovery → Messaging → Offer → Negotiation → Payment → Campaign Delivery → Approval → Payout → Review
```

**Monetization:** 10% transaction commission on completed collaboration value.

---

## 2. Architecture Decision

- **Architecture:** Production-grade modular monolith (NOT microservices)
- **Monorepo** managed with **pnpm workspaces**
- Frontend and Backend developed **together, chunk by chunk**

---

## 3. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18+ with TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Server State | TanStack Query (React Query) |
| Client State | Zustand |
| Forms | React Hook Form |
| Validation | Zod (shared with backend) |
| Routing | React Router v6+ |
| Real-time | Socket.IO Client |
| Icons | Lucide React |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | NestJS with TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache/Queue | Redis + BullMQ |
| Real-time | Socket.IO (NestJS Gateway) |
| Auth | JWT (access + refresh tokens) + Google OAuth |
| Email | Resend (or equivalent) |
| File Storage | Cloudinary |
| Payments | Razorpay (India) + Stripe (International) via adapter pattern |

### Infrastructure
| Layer | Technology |
|---|---|
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| CDN/Security | Cloudflare |
| Deployment | Hostinger VPS (initially) |

---

## 4. Project Structure (Monorepo)

```
2BeCollab/
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── app/            # Router, providers, config
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── features/       # Feature modules (auth, creator, business, etc.)
│   │   │   ├── pages/          # Route pages
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # API client, websocket, validation
│   │   │   ├── stores/         # Zustand stores
│   │   │   └── types/          # TypeScript types
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/         # Guards, interceptors, filters, decorators, pipes, utils
│   │   │   ├── modules/        # Domain modules (auth, users, creators, etc.)
│   │   │   ├── jobs/           # BullMQ job processors
│   │   │   └── prisma/         # Schema + migrations
│   │   ├── test/
│   │   └── package.json
│   │
│   └── worker/                 # Background workers (later)
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   ├── validation/             # Shared Zod schemas
│   └── config/                 # Shared configs (ESLint, Prettier, TSConfig)
│
├── infra/
│   └── docker/                 # Docker Compose, Dockerfiles
│
├── docs/                       # Architecture docs
├── .github/workflows/          # CI/CD
├── package.json                # Root package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── INSTRUCTIONS.md             # THIS FILE
```

---

## 5. Coding Conventions

### General
- **TypeScript strict mode** everywhere
- **No `any` types** — use proper typing
- **camelCase** for variables/functions, **PascalCase** for classes/components/types
- **kebab-case** for file names
- All IDs use **UUID/ULID** — never expose sequential IDs publicly
- Store money as **integer minor units + ISO currency code** (e.g., `1000` = ₹10.00, currency: `INR`)

### Backend (NestJS)
- **Thin controllers** — all business logic in services
- Each module follows: `controller → service → repository (Prisma)`
- Use **DTOs with class-validator** for input validation
- Use **Guards** for auth/authorization
- Use **Interceptors** for response transformation
- Use **Filters** for error handling
- Domain modules must NOT directly access another module's tables — use that module's service
- All sensitive actions must create **audit log entries**
- API prefix: `/api/v1`

### Frontend (React)
- **Functional components only** with hooks
- Feature-based folder structure
- Use **TanStack Query** for all server data — no manual fetch/setState for API data
- Use **Zustand** only for small client-side state (UI state, modals, etc.)
- Shared validation via **Zod** schemas from `packages/validation`
- Responsive design with Tailwind CSS
- Every interactive element must have a **unique ID** for testing

### Database
- Use **Prisma** for schema, migrations, and queries
- **Foreign keys** on all relationships
- **Unique constraints** where business rules require them
- **Check constraints** for enums/status fields
- **Indexes** based on query patterns (documented in architecture doc §31)
- Use **transactions** for multi-table mutations (offer acceptance, payments, etc.)

### API Design
- RESTful with `/api/v1` prefix
- Consistent error response format: `{ statusCode, message, error }`
- Cursor-based pagination for lists
- Rate limiting on all endpoints
- Payment webhooks must be **signature-verified** and **idempotent**

---

## 6. Environment Variables Pattern

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/twobecollab

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

# Email (Resend)
RESEND_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
APP_URL=http://localhost:5173
API_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

---

## 7. Development Chunks (Build Order)

Each chunk builds frontend + backend together. Complete one before starting the next.

| Chunk | Name | Scope |
|---|---|---|
| **1** | **Installation & Setup** | Monorepo, Docker, DB, base configs, health check |
| **2** | **Auth Module** | Register, login, email verify, JWT, Google OAuth, refresh tokens |
| **3** | **User & Profile Module** | User model, creator profiles, business profiles, profile CRUD |
| **4** | **Social Accounts & Portfolio** | Social platform linking, audience metrics, portfolio items |
| **5** | **Services & Packages** | Creator service/package tiers, pricing |
| **6** | **Creator Search** | Search, filters, pagination, public creator profile page |
| **7** | **Messaging** | WebSocket chat, conversations, real-time messaging |
| **8** | **Campaigns** | Campaign CRUD, brief wizard, campaign discovery for creators |
| **9** | **Applications & Invitations** | Creator applies to campaign, brand invites creator |
| **10** | **Offers & Negotiation** | Offer state machine, counter-offers, version history |
| **11** | **Contracts** | Contract creation from accepted offer, term snapshots |
| **12** | **Payments** | Payment provider adapter, checkout, webhooks, idempotency |
| **13** | **Deliverables** | Submission, revision cycle, approval workflow |
| **14** | **Payouts** | Creator payout flow, wallet, withdrawal |
| **15** | **Reviews** | Two-way reviews, rating aggregation |
| **16** | **Disputes** | Dispute workflow, evidence, admin resolution |
| **17** | **Notifications** | BullMQ workers, in-app + email notifications |
| **18** | **Admin Panel** | User mgmt, verification, moderation, audit logs |
| **19** | **Analytics & Dashboard** | Creator/brand dashboards, metrics, charts |
| **20** | **AI Features** | AI gateway, matching, brief generation |
| **21** | **Polish & Production** | SEO, performance, security hardening, CI/CD |

---

## 8. User Roles & Permissions

| Role | Description |
|---|---|
| `CREATOR` | Manages profile, services, portfolio; receives offers; submits work; gets paid |
| `BUSINESS` | Discovers creators, creates campaigns/offers, pays, approves, reviews |
| `ADMIN` | Full platform access, verification, moderation, disputes, finance |
| `SUPPORT` | Limited operational access for customer support |

---

## 9. Key Domain Rules

1. **Controllers are thin** — domain logic lives in services
2. **Modules own their data** — never directly write to another module's tables
3. **Money = integer minor units** — `amount_minor` + `currency` (ISO 4217)
4. **Contracts snapshot everything** — never reconstruct from mutable profile data
5. **Offer history is immutable** — use versioned offer records
6. **Webhooks must be idempotent** — deduplicate by provider event ID
7. **Payment state comes from provider webhooks** — never trust frontend redirects
8. **Audit sensitive actions** — login, role changes, payments, refunds, disputes
9. **Rate limit everything** — different limits per action type
10. **No arbitrary cascade deletes** — preserve financial/contract history

---

## 10. Running the Project

```bash
# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL + Redis)
docker compose up -d

# Generate Prisma client
cd apps/api && npx prisma generate

# Run database migrations
cd apps/api && npx prisma migrate dev

# Start backend
cd apps/api && pnpm dev

# Start frontend
cd apps/web && pnpm dev
```

---

## 11. Reference Document

Full architecture details: `creator-brand-marketplace-complete-architecture-v3.md`

Refer to specific sections when building each chunk:
- §7-9: System architecture, frontend/backend structure
- §10-11: Database architecture & data model
- §12-13: API architecture & auth
- §14-20: Feature-specific architecture
- §39-113: Production-grade domain architecture
