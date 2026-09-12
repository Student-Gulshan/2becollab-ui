# Creator–Brand Marketplace — Technical Architecture

**Version:** 3.0  
**Date:** September 2026

## 1. Executive Summary

A two-sided marketplace connecting businesses with creators for paid promotions, using an Upwork-style workflow:

**Discovery → Messaging → Offer → Negotiation → Payment → Campaign Delivery → Approval → Payout → Review**

Primary monetization: transaction commission, e.g. 10% of completed collaboration value.

Recommended architecture: a **production-grade modular monolith initially, designed with explicit domain boundaries and extraction seams for future services**. The full platform architecture covers web, APIs, workers, payments, trust, analytics, AI, integrations, administration, observability, compliance, disaster recovery and future scale.

---

## 2. Product Vision & Scope

### Vision
Make creator-brand collaborations as easy and structured as hiring a freelancer.

### Core promise
Find the right creator → communicate safely → agree on deliverables → pay → manage delivery → resolve problems → review.

### Initial release out of scope
- Native mobile apps
- Complex enterprise CRM
- Advanced AI
- Full analytics suite
- Voice/video calls
- International tax automation
- Microservice infrastructure

---

## 3. Users and Roles

| Role | Responsibilities | Permissions |
|---|---|---|
| Creator | Profile, services, portfolio, offers, delivery, earnings | Manage own data; receive offers; submit work; receive payouts |
| Business | Discover creators, message, campaigns/offers, pay | Search; contact; create offers; pay; approve; review |
| Admin | Trust, moderation, disputes, finance | Verify/suspend; resolve disputes; view transactions; audit |
| Support | Customer support | Limited operational access |
| Agency (later) | Multiple creators/clients | Team workflows |

---

## 4. Core Business Flows

### Creator onboarding

```text
Sign up
 → Verify email
 → Create profile
 → Add social accounts
 → Add niche/audience data
 → Add services/prices
 → Upload portfolio
 → Set availability
 → Optional verification
 → Publish
```

### Business hiring

```text
Business signup
 → Business profile
 → Search/filter creators
 → Creator profile
 → Conversation
 → Offer
 → Accept/reject/counter
 → Contract/order
 → Payment
 → Campaign
 → Deliverables
 → Approval/revision
 → Payout
 → Reviews
```

### Dispute

```text
Issue
 → Dispute
 → Evidence
 → Response
 → Admin review
 → Decision
 → Refund / partial refund / payout release
 → Close
```

---

## 5. Functional Features

- Authentication and email verification
- Creator profiles
- Business profiles
- Social accounts and audience metrics
- Services/packages
- Portfolio
- Creator search and filters
- Internal messaging
- Offers and counter-offers
- Contracts/orders
- Campaigns
- Deliverables
- Payments
- Payouts
- Reviews
- Disputes
- Notifications
- Admin/moderation
- Audit logs

---

## 6. Initial Release Scope & Full-Platform Roadmap

### Build first
- Registration/login
- Creator/business profiles
- Social links
- Search + filters
- Internal chat
- Offers/counter-offers
- Basic payment flow
- Campaign/order tracking
- Deliverable submission
- Reviews
- Admin

### Defer
- Native mobile apps
- Voice/video
- Advanced AI
- Complex analytics
- Elasticsearch/OpenSearch
- Enterprise CRM
- International tax automation
- Advanced fraud models
- Agency accounts

---

## 7. System Architecture

```text
                    React + TypeScript
                           │
                    REST / WebSocket
                           │
                    ┌──────▼──────┐
                    │   NestJS    │
                    │   Modular   │
                    │   Monolith  │
                    └───┬─────┬───┘
                        │     │
                 ┌──────▼─┐ ┌─▼─────┐
                 │Postgres│ │ Redis │
                 │ Prisma │ │ Queue │
                 └────────┘ └───┬───┘
                                │
                              Worker
                                │
             ┌──────────────────┼────────────────┐
             ▼                  ▼                ▼
         Email service     Media storage     Payment provider
```

### Recommended stack
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + NestJS + TypeScript
- Database: PostgreSQL + Prisma
- Cache/queues: Redis + BullMQ
- Real-time: WebSockets
- Media: Cloudinary or Cloudflare R2
- Email: Resend or another transactional email provider
- Deployment: Docker-based environments with production-ready separation; Hostinger VPS may be used initially, but production topology must allow migration to managed PostgreSQL/Redis/object storage and horizontally scaled API/workers without redesign
- CDN/security: Cloudflare
- Payments: Marketplace/platform-capable payment provider(s), with provider-specific adapters and reconciliation

---

## 8. Frontend Architecture

```text
src/
  app/
    router/
    providers/
    config/
  components/
    ui/
    forms/
    layout/
  features/
    auth/
    creator/
    business/
    search/
    messaging/
    offers/
    campaigns/
    payments/
    reviews/
  pages/
    public/
    creator/
    business/
    admin/
  hooks/
  lib/
    api/
    websocket/
    validation/
  stores/
  types/
```

Use TanStack Query for server state and Zustand for small client-side state.

---

## 9. Backend Architecture

```text
src/
  main.ts
  app.module.ts
  common/
    guards/
    interceptors/
    filters/
    decorators/
    pipes/
    utils/
  modules/
    auth/
    users/
    creators/
    businesses/
    social-accounts/
    services/
    portfolios/
    search/
    messaging/
    offers/
    contracts/
    campaigns/
    deliverables/
    payments/
    payouts/
    reviews/
    disputes/
    notifications/
    admin/
  jobs/
    email/
    notifications/
    payments/
    analytics/
  prisma/
    schema.prisma
    migrations/
```

Controllers should be thin. Domain logic belongs in services/use cases.

---

## 10. Database Architecture

Use PostgreSQL with Prisma.

Store money as **integer minor units + ISO currency**, not floating-point values.

Use transactions for:
- Offer acceptance
- Order creation
- Payment state changes
- Refunds
- Review eligibility

---

## 11. Data Model

| Table | Purpose |
|---|---|
| users | Identity, role, status |
| creator_profiles | Creator profile |
| business_profiles | Business profile |
| social_accounts | Social platforms/metrics |
| services | Creator packages |
| portfolio_items | Work samples |
| conversations | Chat conversations |
| messages | Chat messages |
| campaigns | Campaign briefs |
| offers | Negotiated offers |
| contracts | Accepted terms |
| deliverables | Submitted work |
| payments | Payment transactions |
| payouts | Creator payouts |
| reviews | Ratings |
| disputes | Dispute cases |
| notifications | Notifications |
| files | File metadata |
| audit_logs | Sensitive/system actions |

### Relationships

```text
users
 ├── creator_profiles
 ├── business_profiles
 ├── messages
 ├── reviews
 ├── notifications
 └── audit_logs

creator_profiles
 ├── social_accounts
 ├── services
 ├── portfolio_items
 ├── offers
 └── payouts

business_profiles
 ├── campaigns
 ├── conversations
 └── payments

campaigns
 └── offers

offers
 └── contract

contracts
 ├── deliverables
 ├── payments
 ├── reviews
 └── disputes
```

---

## 12. API Architecture

Use `/api/v1`.

```text
GET    /api/v1/creators
GET    /api/v1/creators/:id
PATCH  /api/v1/creators/me
POST   /api/v1/creators/me/services

GET    /api/v1/search/creators

GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages

POST   /api/v1/offers
GET    /api/v1/offers/:id
POST   /api/v1/offers/:id/accept
POST   /api/v1/offers/:id/reject
POST   /api/v1/offers/:id/counter

POST   /api/v1/campaigns
GET    /api/v1/campaigns/:id

POST   /api/v1/contracts/:id/deliverables
POST   /api/v1/deliverables/:id/approve
POST   /api/v1/deliverables/:id/revision

POST   /api/v1/payments/checkout
POST   /api/v1/payments/webhook

POST   /api/v1/reviews
POST   /api/v1/disputes
GET    /api/v1/notifications
```

Payment webhooks must be signature-verified and idempotent.

---

## 13. Authentication & Authorization

Use secure sessions/JWTs with short-lived credentials and secure HttpOnly cookies.

```text
Request
 → Authentication
 → User
 → Role/permission check
 → Resource ownership check
 → Controller
 → Use case
```

Include:
- Email verification
- Password reset
- Rate limiting
- Optional 2FA
- Audit logs

---

## 14. Messaging

Use WebSockets for real-time delivery while persisting messages to PostgreSQL.

```text
React
 → WebSocket
 → NestJS Gateway
 → Authenticate
 → Authorize conversation
 → Persist message
 → Publish event
 → Notify recipient
```

Redis can support presence/pub-sub and future horizontal scaling.

---

## 15. Creator Search

Start with PostgreSQL indexes/full-text search.

Search by:
- Platform
- Niche
- Followers
- Engagement
- Location
- Language
- Audience
- Price
- Availability

Use cursor pagination for large result sets.

---

## 16. Offers, Negotiation & Contracts

```text
DRAFT
 ↓
SENT
 ├── ACCEPTED → CONTRACT_CREATED
 ├── REJECTED
 ├── EXPIRED
 └── COUNTERED
```

Once accepted, snapshot the agreed price and scope so future changes to a creator's public service don't alter the existing contract.

---

## 17. Campaigns & Deliverables

```text
Campaign
 ├── Creator A → Contract → Deliverables
 ├── Creator B → Contract → Deliverables
 └── Creator C → Contract → Deliverables
```

Deliverable states:
- SUBMITTED
- REVISION_REQUESTED
- APPROVED
- REJECTED

Define revision limits and deadlines in the contract.

---

## 18. Payments, Fees & Payouts

Use a payment provider that supports marketplace/platform payments and creator payouts in your supported countries.

### Do NOT implement your own escrow

Avoid:

```text
Business
 ↓
Your bank account
 ↓
Your database says "money held"
 ↓
Creator
```

Your database status does not make your company a legitimate escrow provider.

Instead, use a marketplace-capable payment provider for the actual payment/payout flow.

### Conceptual flow

```text
Business
   │ checkout
   ▼
Payment Provider
   ├── Provider fee
   ├── Platform commission
   └── Creator payout
```

Example:
- Deal: ₹10,000
- Platform commission: 10% = ₹1,000
- Creator amount: ₹9,000
- Actual provider fees depend on provider/country.

Track:
- Gross amount
- Platform fee
- Provider fee
- Creator amount
- Currency
- Provider transaction ID
- Payment status
- Payout status

Do not build a proprietary wallet or hold customer funds without appropriate legal/payment-provider guidance.

---

## 19. Reviews & Disputes

Reviews should be available after eligible completed contracts.

### Dispute states

```text
OPEN
 → UNDER_REVIEW
 → WAITING_FOR_RESPONSE
 → DECIDED
 → REFUND / PARTIAL_REFUND / PAYOUT_RELEASE
 → CLOSED
```

---

## 20. Notifications

Use events + BullMQ.

```text
Domain event
 → BullMQ
 → Notification worker
    ├── In-app
    ├── Email
    └── Push later
```

Important events:
- New message
- New offer
- Counter-offer
- Accepted offer
- Payment success/failure
- Deadline reminder
- Deliverable submitted
- Revision requested
- Approval
- Payout
- Review
- Dispute

---

## 21. File Storage

For the creator marketplace, use **Cloudinary** or **Cloudflare R2**.

### Recommended simple MVP

```text
Hostinger VPS
 ├── NestJS
 ├── PostgreSQL
 └── Redis

Cloudinary
 ├── Creator images
 ├── Portfolio media
 └── Campaign media

Email provider
 └── Transactional emails
```

You do not need both Cloudinary and R2 initially.

Cloudinary is useful for:
- Image resizing
- Optimization
- Video processing
- CDN delivery
- Transformations

For large files, prefer direct browser-to-storage uploads rather than routing videos through NestJS.

---

## 22. AI Matching

AI should be a ranking layer, not the source of truth.

```text
Business prompt
 ↓
LLM extraction
 ↓
Structured requirements
 ↓
PostgreSQL retrieval
 ↓
Ranking
 ↓
Top creators
 ↓
Optional AI explanation
```

Potential ranking factors:
- Category
- Geography
- Audience
- Followers
- Engagement
- Budget
- Platform
- Availability
- Historical performance

Add pgvector/dedicated vector search only after enough data exists.

---

## 23. Admin Panel

Modules:
- Users
- Creator verification
- Business verification
- Campaigns
- Offers/orders
- Payments
- Payouts
- Disputes
- Reports
- Moderation
- Audit logs

Sensitive admin actions require permissions and audit records.

---

## 24. Anti-Bypass & Trust

Users may discover each other and move to WhatsApp/email/direct payment.

Don't rely only on aggressive blocking.

Make on-platform transactions valuable through:
- Payment protection/process
- Contracts
- Disputes
- Campaign tracking
- Receipts
- Reputation
- Verification
- Centralized records

Clearly disclose commissions and prohibit off-platform circumvention where legally appropriate.

---

## 25. Security

- HTTPS
- Secure cookies
- Strong password hashing
- Input validation
- Rate limiting
- Resource authorization
- CSRF protection where applicable
- XSS protection
- Prisma/parameterized DB access
- Secure file uploads
- Payment webhook verification
- Idempotency keys
- Audit logs
- Secure secrets
- Dependency scanning
- Regular backups

---

## 26. Infrastructure & Deployment

Since the Hostinger VPS is already available:

```text
Internet
 ↓
Cloudflare
 ├── Frontend
 └── API
      ├── NestJS
      ├── Worker
      ├── PostgreSQL
      └── Redis

External:
 ├── Cloudinary/R2
 ├── Email provider
 └── Payment provider
```

For MVP, PostgreSQL and Redis can run on the existing VPS.

Do not expose PostgreSQL directly to the public internet.

Use separate development, staging and production environments.

---

## 27. CI/CD

Recommended:
- GitHub
- GitHub Actions
- Docker

Pipeline:

```text
git push
 → lint
 → typecheck
 → unit tests
 → build
 → migration checks
 → staging
 → smoke tests
 → production approval
 → deploy
```

---

## 28. Monitoring

### Technical
- API latency
- Error rate
- WebSocket connections
- Queue depth
- Worker failures
- Database health
- Storage errors
- Payment webhook failures

### Business
- Creator activation
- Business activation
- Search-to-contact conversion
- Contact-to-offer conversion
- Offer acceptance
- Payment conversion
- Completed campaigns
- GMV
- Take rate
- Repeat businesses
- Dispute rate

---

## 29. Project Structure

```text
repo/
  apps/
    web/
    api/
    worker/
  packages/
    ui/
    types/
    config/
    eslint-config/
  infra/
    docker/
    terraform/
  docs/
  .github/
    workflows/
  package.json
  pnpm-workspace.yaml
```

A simpler first release can use separate web/API repositories.

---

## 30. API Endpoint Map

| Domain | Endpoint | Purpose |
|---|---|---|
| Auth | POST /auth/register | Create account |
| Auth | POST /auth/login | Start session |
| Auth | POST /auth/logout | End session |
| Creators | GET /creators | Search creators |
| Creators | GET /creators/:id | Public profile |
| Creators | PATCH /creators/me | Update profile |
| Services | POST /creators/me/services | Create service |
| Business | PATCH /businesses/me | Update business |
| Messaging | GET /conversations | List conversations |
| Messaging | POST /conversations | Start conversation |
| Messaging | POST /conversations/:id/messages | Send message |
| Offers | POST /offers | Create offer |
| Offers | POST /offers/:id/accept | Accept offer |
| Offers | POST /offers/:id/counter | Counter offer |
| Campaigns | POST /campaigns | Create campaign |
| Deliverables | POST /contracts/:id/deliverables | Submit |
| Payments | POST /payments/checkout | Start payment |
| Payments | POST /payments/webhook | Provider webhook |
| Reviews | POST /reviews | Review |
| Disputes | POST /disputes | Open dispute |
| Notifications | GET /notifications | Notifications |

---

## 31. Database Table Map

| Table | Key columns | Important indexes |
|---|---|---|
| users | id, email, role, status | unique email; role/status |
| creator_profiles | id, user_id, niche, location | user_id; niche; location |
| business_profiles | id, user_id, industry | user_id; industry |
| social_accounts | creator_id, platform, followers | creator_id; platform; followers |
| services | creator_id, price, currency | creator_id; price |
| conversations | id, creator_id, business_id | participant pair |
| messages | conversation_id, sender_id, created_at | conversation_id + created_at |
| campaigns | business_id, status, budget | business_id; status |
| offers | campaign_id, creator_id, status | campaign_id; creator_id; status |
| contracts | offer_id, status | offer_id; status |
| deliverables | contract_id, status | contract_id; status |
| payments | contract_id, provider_id, status | provider_id; status |
| payouts | contract_id, creator_id, status | creator_id; status |
| reviews | contract_id, reviewer_id, reviewee_id | contract_id; reviewee_id |
| disputes | contract_id, status | contract_id; status |
| notifications | user_id, read_at, created_at | user_id + created_at |

---

## 32. Monetization

### Primary
Transaction commission.

Example:
**10% of completed collaboration value**, subject to payment costs and market testing.

| Revenue stream | When | Example |
|---|---|---|
| Transaction commission | MVP | 10% |
| Business subscription | Later | $29–$99/month |
| Featured creator placement | Later | Paid visibility |
| AI matching | Later | Premium matching |
| Campaign management | Later | Managed-service fee |

Prove marketplace liquidity before optimizing pricing.

---

## 33. Roadmap

| Phase | Goal | Deliverables |
|---|---|---|
| 0 | Validation | Niche, interviews, willingness to pay, policies |
| 1 | MVP | Profiles, search, chat, offers, payments, campaigns, delivery, reviews, admin |
| 2 | Trust | Verification, contracts, disputes, notifications, analytics |
| 3 | Intelligence | AI matching, recommendations, creator scoring, fraud signals |
| 4 | Scale | Teams/agencies, advanced analytics, mobile, API, international capabilities |

---

## 34. Scaling Strategy

Scale in this order:

```text
1. Optimize SQL/indexes
2. Add caching
3. Add read replicas if necessary
4. Dedicated workers
5. Better search infrastructure
6. Extract services only when justified
```

Avoid premature microservices.

---

## 35. Architecture Risks

| Risk | Priority | Mitigation |
|---|---|---|
| Marketplace liquidity | High | Niche down; recruit supply and demand |
| Off-platform deals | High | Trust + on-platform workflow + policy |
| Payment/regulatory complexity | High | Marketplace provider + legal/accounting review |
| Fake social metrics | High | Verification + refresh |
| Disputes | Medium/High | Clear scope, evidence, revision limits |
| Spam/scams | High | Rate limits, verification, moderation |
| Search relevance | Medium | Deterministic search first |
| Premature microservices | Medium | Modular monolith |
| File abuse | Medium | Signed uploads, size/type limits, scanning |

---

## 36. Build Checklist

- [x] Define initial niche and launch geography *(Tech, Lifestyle & Fitness; India / US multi-currency)*
- [x] Write terms/privacy/refund rules *(Implemented in `/terms`, `/privacy`, and `/refund-policy`)*
- [x] Set up repository, environments and CI *(pnpm monorepo, Docker Compose, `.github/workflows/ci.yml`)*
- [x] Create PostgreSQL + Prisma schema *(17 models including audit_logs, files, contracts, escrow, deliverables)*
- [x] Implement authentication and roles *(JWT, Google OAuth, Refresh Tokens, CREATOR, BUSINESS, ADMIN, SUPPORT)*
- [x] Build creator onboarding/profile *(Multi-platform social metrics, packages/services, portfolio items)*
- [x] Build business onboarding *(Brand profiles, briefs, hiring flow)*
- [x] Build creator search *(Multi-parameter filter: niche, platform, followers, price, rating, location)*
- [x] Build creator profile *(Public creator portfolio, review history, packages)*
- [x] Build messaging *(Socket.IO WebSocket Gateway + PostgreSQL persistence + unread counter)*
- [x] Build offer/counter-offer state machine *(Draft, Pending, Accepted, Countered, Rejected, Expired)*
- [x] Integrate marketplace-capable payments *(Razorpay & Stripe Connect Platform Escrow + Mock fallback)*
- [x] Implement webhook verification/idempotency *(HMAC-SHA256 signature verification)*
- [x] Build campaign/order workflow *(Campaign briefs, offer negotiations, contract binding)*
- [x] Build deliverable submission/approval *(Deliverable files/links, revision cycle, escrow release)*
- [x] Build payout workflow through payment provider *(UPI, Bank Transfer, Razorpay Route, Stripe Connect)*
- [x] Build reviews *(Contract-bound 1–5 star reviews with automatic rating aggregation)*
- [x] Build disputes/admin *(Dispute evidence submission, admin resolution, refund/payout split)*
- [x] Build notification worker *(BullMQ workers for email-queue and notifications-queue on Redis)*
- [x] Add monitoring/audit logs *(Health check `/api/v1/health` + `audit_logs` model and admin inspector)*
- [x] Test end-to-end with test payments *(100% automated 11-phase verification passed)*
- [ ] Recruit initial creators/businesses *(Post-launch operational milestone)*
- [ ] Measure completed collaborations *(Post-launch marketplace metrics)*

---


# Part III: Complete End-to-End Production Architecture

This section defines the architecture for the **whole application**, not merely an MVP.
The platform must support the complete lifecycle:

```text
Identity
 → Onboarding
 → Verification
 → Discovery
 → Search / Matching
 → Campaign
 → Application / Invitation
 → Messaging
 → Negotiation
 → Contract
 → Payment
 → Collaboration
 → Deliverables
 → Revisions
 → Approval
 → Settlement
 → Payout
 → Review
 → Analytics
 → Re-hiring
```

The design should be production-safe from the beginning while avoiding unnecessary operational
complexity. A modular monolith is an implementation choice, not a domain-model compromise.

---

## 39. Platform Domain Map

Organize the backend around bounded business domains:

```text
┌───────────────────────────────────────────────────────────────┐
│                     PLATFORM APPLICATION                      │
├──────────────┬───────────────┬───────────────┬───────────────┤
│ Identity     │ Marketplace   │ Collaboration │ Money         │
│ Auth         │ Creators      │ Campaigns     │ Payments      │
│ Sessions     │ Businesses    │ Applications  │ Payouts       │
│ OAuth        │ Services      │ Offers        │ Refunds       │
│ Verification │ Search       │ Contracts     │ Reconciliation│
├──────────────┼───────────────┼───────────────┼───────────────┤
│ Trust        │ Communication│ Intelligence  │ Platform      │
│ Moderation   │ Messaging     │ Matching      │ Notifications │
│ Disputes     │ Notifications │ AI Assistant  │ Files         │
│ Reports      │ Email         │ Analytics     │ Audit         │
│ Reviews      │               │              │ Settings      │
└──────────────┴───────────────┴───────────────┴───────────────┘
```

Recommended modules:

```text
identity
users
creators
businesses
teams
verification
social-accounts
services
portfolio
campaigns
applications
invitations
conversations
messages
offers
contracts
deliverables
payments
refunds
payouts
ledger
reconciliation
reviews
disputes
reports
moderation
search
matching
analytics
affiliate
products
notifications
files
content/blog
admin
audit
settings
integrations
ai
```

Each module owns its domain rules. Modules communicate through explicit application services,
domain events and stable interfaces rather than directly manipulating another module's tables.

---

## 40. Complete Request Architecture

Every HTTP request:

```text
Client
  ↓
DNS
  ↓
Cloudflare
  ↓
WAF / DDoS / TLS / Rate Limit
  ↓
Reverse Proxy / Load Balancer
  ↓
NestJS API
  ↓
Request ID + Structured Logging
  ↓
Authentication
  ↓
Input Validation
  ↓
Authorization
  ↓
Use Case
  ↓
Domain Rules
  ↓
Database Transaction
  ↓
Outbox Event
  ↓
Response
```

Every WebSocket request:

```text
Socket connection
  ↓
Authenticate
  ↓
Authorize namespace/room
  ↓
Rate limit
  ↓
Validate event
  ↓
Execute use case
  ↓
Persist durable state
  ↓
Emit event
```

Every external webhook:

```text
Provider
  ↓
Webhook endpoint
  ↓
Verify signature
  ↓
Persist raw event metadata
  ↓
Deduplicate provider event ID
  ↓
Transactionally update state
  ↓
Create outbox event
  ↓
Async processing
```

---

## 41. Domain Ownership Rules

Do not allow arbitrary module-to-module database writes.

Example:

```text
Payments module owns:
  payment_orders
  payment_attempts
  refunds
  provider references
  reconciliation

Payouts module owns:
  payout requests
  payout attempts
  payout status

Contracts module owns:
  contract
  contract terms
  contract state
  contract events

Deliverables module owns:
  deliverables
  versions
  revision requests
  approval state
```

Another module should call the owning module's application service or consume its events.

This makes future extraction into microservices possible without rewriting the business model.

---

## 42. Full Contract Lifecycle

```text
OFFER ACCEPTED
      ↓
CONTRACT CREATED
      ↓
CONTRACT TERMS SNAPSHOTTED
      ↓
PAYMENT REQUIREMENT CREATED
      ↓
PAYMENT CONFIRMED BY PROVIDER
      ↓
CONTRACT ACTIVATED
      ↓
DELIVERABLE WORKFLOW
      ↓
ALL DELIVERABLES APPROVED
      ↓
CONTRACT COMPLETION
      ↓
SETTLEMENT ELIGIBILITY
      ↓
PAYOUT INITIATED
      ↓
PAYOUT COMPLETED
      ↓
REVIEW WINDOW
      ↓
CONTRACT CLOSED
```

A contract must snapshot:

- creator identity
- business identity
- deliverables
- quantities
- price
- currency
- deadlines
- revision limits
- content usage rights
- exclusivity terms
- cancellation terms
- refund rules
- platform fee
- applicable taxes/fees
- accepted timestamp
- contract version

Never reconstruct historical contracts from mutable profile/service data.

---

## 43. Campaign Architecture

A campaign is a business-owned hiring container.

```text
Campaign
 ├── Brief
 ├── Requirements
 ├── Budget
 ├── Timeline
 ├── Applications
 ├── Invitations
 ├── Selected creators
 └── Contracts
```

Campaign states:

```text
DRAFT
 → PUBLISHED
 → PAUSED
 → APPLICATION_REVIEW
 → ACTIVE
 → COMPLETED
 → ARCHIVED
```

Rules:

- Only authorized business members can modify a campaign.
- Published commercial terms should be versioned.
- Existing contracts must not change when the campaign is edited.
- Campaign closure must not invalidate active contracts.
- Budget calculations must be server-side.

---

## 44. Application Architecture

```text
Creator
  ↓
Apply
  ↓
Campaign Application
  ↓
Brand Review
  ├── SHORTLISTED
  ├── REJECTED
  └── SELECTED
           ↓
         Offer
```

Application data:

- creator
- campaign
- pitch
- proposed price
- proposed timeline
- selected deliverables
- attachments
- status
- timestamps
- review notes

Unique constraint:

```text
(campaign_id, creator_id)
```

unless multiple application rounds are explicitly supported.

---

## 45. Invitation Architecture

Invitations are separate from applications:

```text
Brand
  ↓
Invitation
  ↓
Creator
  ├── ACCEPT
  ├── DECLINE
  └── NEGOTIATE
```

Invitation state:

```text
DRAFT
SENT
VIEWED
ACCEPTED
DECLINED
EXPIRED
CANCELLED
```

An accepted invitation may create an offer; it should not silently create a contract.

---

## 46. Negotiation Architecture

Every commercial negotiation needs an immutable history.

```text
Offer v1
   ↓ counter
Offer v2
   ↓ counter
Offer v3
   ↓ accept
Contract
```

Store:

```text
offers
offer_versions
offer_events
```

An offer version should snapshot:

- amount
- currency
- deliverables
- deadline
- revisions
- usage rights
- cancellation terms
- expiration
- proposer
- created_at

Never overwrite the historical negotiation.

---

## 47. Payment & Financial Architecture

Financial architecture is a separate domain.

```text
Contract
  ↓
Payment Order
  ↓
Provider Checkout
  ↓
Provider Event
  ↓
Payment State
  ↓
Settlement Eligibility
  ↓
Payout
```

Never use:

```text
Frontend redirect = payment success
```

Use:

```text
Provider webhook + provider API reconciliation
```

### Payment states

```text
CREATED
PENDING
AUTHORIZED
CAPTURED
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
DISPUTED
CHARGEBACK
```

### Payout states

```text
NOT_ELIGIBLE
ELIGIBLE
REQUESTED
PROCESSING
PAID
FAILED
REVERSED
```

Payment and payout are separate state machines.

---

## 48. Double-Spend / Double-Payout Protection

Use database constraints and idempotency:

```text
idempotency_keys
webhook_events
payment_attempts
payout_attempts
```

Required invariants:

```text
One provider event ID → one processed event
One operation + actor + idempotency key → one logical command
One contract → no duplicate final settlement
One payout request → no duplicate provider payout
```

Money-changing operations must run inside carefully defined transaction boundaries.

---

## 49. Financial Ledger

Use an append-oriented internal ledger for audit/accounting calculations.

```text
ledger_entries
 ├── payment
 ├── platform_fee
 ├── provider_fee
 ├── refund
 ├── adjustment
 ├── payout
 └── reversal
```

Each entry should contain:

```text
id
contract_id
payment_id
payout_id
type
direction
amount_minor
currency
provider_reference
created_at
```

Ledger entries are never edited by normal application users.

Corrections create compensating entries.

---

## 50. Payment Provider Abstraction

Do not hard-code Razorpay/Stripe logic throughout the business modules.

Use an adapter:

```text
PaymentService
     │
     ├── RazorpayAdapter
     ├── StripeAdapter
     └── MockAdapter
```

Interface examples:

```text
createPaymentOrder()
getPaymentStatus()
refundPayment()
createPayout()
getPayoutStatus()
verifyWebhook()
```

Provider-specific details stay inside the adapter.

This allows:

- India-first provider
- US provider
- future provider
- sandbox/mock provider
- provider migration

without changing the contract/campaign domain.

---

## 51. Reconciliation System

Webhooks can fail. Therefore build reconciliation.

```text
Scheduled Reconciliation
       ↓
Fetch provider transactions
       ↓
Compare with local records
       ↓
Identify mismatch
       ↓
Create reconciliation case
       ↓
Retry / repair / admin review
```

Reconciliation must cover:

- payments
- refunds
- payouts
- chargebacks
- provider fees

Never assume a webhook-only system is perfectly synchronized.

---

## 52. Subscription Architecture

The platform later includes business subscription plans.

Separate:

```text
plans
subscriptions
subscription_items
subscription_events
billing_invoices
billing_payment_methods
usage_counters
```

Subscription billing must not be mixed with collaboration payment records.

Example:

```text
Business subscription
        ≠
Creator collaboration payment
```

---

## 53. Multi-Tenant Team Architecture

Business accounts are organizations.

```text
Business
 ├── Members
 ├── Roles
 ├── Permissions
 ├── Campaigns
 ├── Payments
 ├── Creator Network
 └── Analytics
```

Roles:

```text
OWNER
ADMIN
CAMPAIGN_MANAGER
REVIEWER
FINANCE
ANALYST
SUPPORT
```

Authorization must verify:

```text
user
 ↓
business membership
 ↓
permission
 ↓
resource ownership
```

Never trust a frontend-supplied business ID.

---

## 54. Creator Identity & Verification

Separate account identity from creator profile:

```text
users
creator_profiles
verification_cases
verification_documents
verification_events
```

Verification states:

```text
UNVERIFIED
PENDING
VERIFIED
REJECTED
SUSPENDED
EXPIRED
```

Sensitive verification information should be encrypted/restricted and retained only as required.

---

## 55. Social Account Integration

Architecture:

```text
Creator
  ↓
Connect Social Account
  ↓
OAuth Provider
  ↓
Encrypted Token Storage
  ↓
Social API
  ↓
Metric Snapshot
  ↓
Verification Status
```

Never expose OAuth access/refresh tokens to the frontend.

Metrics should have:

```text
value
source
fetched_at
verification_status
external_account_id
```

Support stale-data indicators.

---

## 56. Search Architecture

Full production search can evolve:

### Stage A

```text
PostgreSQL indexes
+
full-text search
```

### Stage B

```text
Search projection
+
OpenSearch/Elasticsearch
```

### Stage C

```text
Keyword search
+
structured filters
+
semantic/vector search
+
ranking
```

The domain API should not care which search engine is used.

```text
CreatorSearchService
        │
        ├── PostgresSearchAdapter
        └── OpenSearchAdapter
```

---

## 57. Matching & Recommendation Architecture

Use deterministic filtering before AI:

```text
Campaign requirements
      ↓
Hard filters
      ↓
Eligible creators
      ↓
Ranking features
      ↓
Scoring model
      ↓
Optional AI explanation
```

AI must never override hard constraints such as:

- platform requirement
- location requirement
- budget ceiling
- creator availability
- prohibited category
- contractual restriction

Store recommendation explanations and model/version metadata for reproducibility.

---

## 58. AI Architecture

Create an AI gateway:

```text
AI Gateway
 ├── LLM provider A
 ├── LLM provider B
 └── future local model
```

Capabilities:

- campaign brief generation
- outreach generation
- creator-match explanation
- analytics summaries
- moderation assistance
- content classification
- fraud signals

AI output must pass through:

```text
Schema validation
 → policy checks
 → authorization
 → human confirmation where required
```

AI must not autonomously:

- spend money
- approve a contract
- release a payout
- resolve a financial dispute
- change permissions
- delete evidence

---

## 59. Analytics Architecture

Do not run every analytics query against transactional tables forever.

```text
Transactional PostgreSQL
        ↓
Domain / Outbox Events
        ↓
Analytics ingestion
        ↓
Aggregation tables / warehouse
        ↓
Business dashboards
```

Track:

```text
users
creators
businesses
campaigns
applications
offers
contracts
payments
payouts
deliverables
reviews
disputes
GMV
take rate
conversion funnels
retention
repeat hiring
creator earnings
```

Keep operational analytics lightweight initially, but define an event schema from day one.

---

## 60. Event Taxonomy

Example domain events:

```text
UserRegistered
UserVerified
CreatorPublished
BusinessVerified
CampaignPublished
ApplicationSubmitted
InvitationSent
OfferSent
OfferCountered
OfferAccepted
ContractCreated
PaymentCreated
PaymentConfirmed
PaymentFailed
DeliverableSubmitted
RevisionRequested
DeliverableApproved
ContractCompleted
PayoutInitiated
PayoutCompleted
PayoutFailed
ReviewSubmitted
DisputeOpened
DisputeResolved
```

Events should include:

```text
event_id
event_type
aggregate_type
aggregate_id
actor_id
occurred_at
schema_version
payload
```

---

## 61. Transactional Outbox

Never do:

```text
DB transaction
 → commit
 → publish Redis event
```

Use:

```text
BEGIN
  update domain
  insert outbox_event
COMMIT

Outbox worker
  ↓
publish event
  ↓
mark processed
```

Consumers must be idempotent.

This protects the platform against process crashes between database commit and event publication.

---

## 62. Notification Architecture

Central notification service:

```text
Domain Event
  ↓
Notification Rules
  ↓
Notification Jobs
  ├── In-App
  ├── Email
  ├── Push
  └── SMS/WhatsApp later
```

Users need notification preferences:

```text
notification_preferences
```

Do not send duplicate notifications when jobs retry.

Use deterministic notification/event keys.

---

## 63. Email Architecture

Use templates:

```text
email_templates
email_jobs
email_delivery_events
```

Track:

```text
queued
sent
delivered
bounced
failed
```

Email sending is asynchronous.

Never make a critical HTTP request wait for an email provider.

---

## 64. File & Media Architecture

Use object storage as the media layer.

```text
Browser
  ↓
API asks: can this user upload?
  ↓
Authorization
  ↓
Signed upload URL
  ↓
Object storage
  ↓
Validation / scan
  ↓
File READY
```

Private content is accessed with short-lived signed URLs.

Store metadata:

```text
file_id
owner_id
resource_type
resource_id
storage_key
mime_type
size
checksum
scan_status
visibility
created_at
```

Never use original filenames as storage keys.

---

## 65. Content Usage Rights

Creator content needs explicit rights metadata.

For each deliverable:

```text
usage_type
platforms
territory
duration
paid_ads_allowed
organic_use_allowed
whitelisting_allowed
exclusivity
usage_start
usage_end
```

Rights are part of the contract snapshot.

Do not assume "payment made" automatically grants every usage right.

---

## 66. Affiliate Architecture

Separate affiliate economics from normal collaboration payments.

```text
affiliate_programs
affiliate_links
affiliate_clicks
affiliate_conversions
affiliate_commissions
affiliate_payouts
```

Track attribution rules explicitly:

```text
click
 → attribution window
 → conversion
 → validation
 → commission
 → payout eligibility
```

Protect against duplicate conversions and self-referrals.

---

## 67. Product Catalog

Businesses can manage:

```text
products
product_variants
product_media
product_links
campaign_products
```

Keep catalog ownership under the business tenant.

Product deletion should not destroy historical contract snapshots.

---

## 68. Creator Network / CRM

Business-owned creator relationship data:

```text
creator_network_entries
creator_tags
creator_notes
creator_segments
creator_rehire_history
```

Private notes must never be visible to creators.

Authorization must be based on business membership.

---

## 69. Reviews & Reputation

Reviews are immutable user-generated records with controlled moderation.

Rules:

```text
One reviewer
+
One contract
+
One review
```

Store:

- reviewer
- reviewee
- contract
- rating
- category ratings
- comment
- moderation status
- created timestamp

Rating aggregates should be calculated from eligible reviews.

---

## 70. Dispute System

Full dispute workflow:

```text
OPEN
 ↓
EVIDENCE_COLLECTION
 ↓
PARTY_RESPONSE
 ↓
ADMIN_REVIEW
 ↓
DECISION
 ├── REFUND
 ├── PARTIAL_REFUND
 ├── PAYOUT
 └── OTHER_REMEDY
 ↓
CLOSED
```

Dispute evidence is append-only.

Every decision requires:

- admin identity
- reason
- timestamp
- action
- affected financial records

---

## 71. Moderation & Trust

Trust system should cover:

```text
user reports
creator reports
business reports
message abuse
spam
fake metrics
fake reviews
fraud signals
content violations
payment abuse
```

Moderation actions:

```text
WARN
LIMIT
HIDE
SUSPEND
BAN
REQUIRE_VERIFICATION
```

Moderation must be auditable.

---

## 72. Anti-Fraud Architecture

Use risk signals rather than one hard-coded score.

Signals:

```text
account age
verification
payment failures
chargebacks
rapid messaging
duplicate identities
suspicious IP/device patterns
fake engagement
review patterns
multiple accounts
unusual payout behavior
```

Risk scoring can later use ML.

High-risk actions can require:

```text
additional verification
manual review
payment hold by provider rules
```

Do not invent a financial hold mechanism outside the payment provider.

---

## 73. Rate Limiting

Different limits per action:

```text
login
signup
password reset
message send
offer creation
application submission
file upload
search
AI requests
webhooks
admin APIs
```

Use Redis-backed rate limiting for distributed API instances.

For security-critical actions, also use database-backed state where necessary.

---

## 74. API Architecture

Use:

```text
/api/v1
```

Organize endpoints by domain:

```text
/auth
/users
/creators
/businesses
/teams
/campaigns
/applications
/invitations
/conversations
/messages
/offers
/contracts
/deliverables
/payments
/refunds
/payouts
/reviews
/disputes
/search
/matching
/analytics
/affiliate
/products
/notifications
/files
/admin
/integrations
/ai
```

Every mutating endpoint must define:

```text
auth
authorization
validation
state transition
idempotency
transaction boundary
audit event
```

---

## 75. API Versioning & Compatibility

Use:

```text
/api/v1
/api/v2
```

Do not make breaking API changes silently.

For frontend/backend deployments:

```text
Old frontend + new API
New frontend + old API
```

should remain compatible during controlled deployments where practical.

---

## 76. Database Strategy

PostgreSQL is the transactional source of truth.

Production configuration should include:

- connection pooling
- automated backups
- point-in-time recovery where available
- encryption at rest
- restricted network access
- migration management
- monitoring
- slow-query analysis
- indexes based on real query patterns

Use UUID/ULID-style identifiers consistently.

Public IDs should not expose sequential sensitive business information.

---

## 77. Database Integrity

Use:

- foreign keys
- unique constraints
- check constraints
- not-null constraints
- appropriate cascade/restrict rules
- transaction isolation appropriate to the operation

Critical examples:

```text
campaign_application(campaign_id, creator_id) UNIQUE
review(contract_id, reviewer_id) UNIQUE
webhook_event(provider, provider_event_id) UNIQUE
idempotency(actor_id, operation, key) UNIQUE
contract(offer_id) UNIQUE
```

Database constraints are the final defense against application bugs.

---

## 78. Cache Architecture

Cache only data that can tolerate staleness.

Good cache candidates:

```text
public creator profile
search metadata
niche lists
static configuration
feature flags
rate limits
presence
```

Do not treat Redis as authoritative for:

```text
payments
contracts
payouts
reviews
permissions
audit logs
```

Use explicit cache invalidation/versioning where required.

---

## 79. WebSocket Scaling

For one instance:

```text
NestJS Gateway
```

For multiple instances:

```text
Load Balancer
     ↓
API instance A ─┐
API instance B ─┼─ Redis adapter
API instance C ─┘
```

Persist messages in PostgreSQL before acknowledging durable message creation.

Use reconnect handling and missed-message synchronization.

---

## 80. Background Worker Architecture

Separate worker responsibilities:

```text
worker/
 ├── notifications
 ├── email
 ├── payment-reconciliation
 ├── payout-reconciliation
 ├── analytics
 ├── social-metrics
 ├── media-processing
 ├── campaign-deadlines
 ├── offer-expiration
 ├── moderation
 └── AI jobs
```

Workers must be independently retryable and idempotent.

---

## 81. Scheduler Architecture

Do not rely on in-memory timers.

Scheduled jobs should query database state:

```text
Every N minutes
  ↓
Find overdue/unprocessed records
  ↓
Claim jobs
  ↓
Process
  ↓
Record result
```

This makes missed schedules recoverable.

---

## 82. Observability

Use three pillars:

```text
Logs
Metrics
Traces
```

Every request gets:

```text
request_id
trace_id
```

Important dashboards:

```text
API latency
5xx rate
DB latency
queue latency
worker failures
WebSocket connections
payment failures
payout failures
webhook failures
storage failures
login abuse
```

---

## 83. Audit Architecture

Audit sensitive operations:

```text
login/security changes
role changes
verification decisions
contract acceptance
payment actions
refunds
payouts
dispute decisions
moderation
admin changes
data exports
account deletion
```

Audit records should contain:

```text
actor
action
resource
before/after summary where safe
request_id
IP/device metadata where legally appropriate
timestamp
```

Never log secrets.

---

## 84. Security Architecture

Required:

```text
HTTPS
secure cookies
Argon2id password hashing
refresh-token rotation
CSRF protection for cookie-authenticated mutations
CORS allowlist
CSP
HSTS
secure headers
input validation
output encoding
rate limiting
BOLA protection
SQL injection protection
signed URLs
webhook signatures
secret management
MFA for admins
dependency scanning
container scanning
backup encryption
```

Security must be enforced server-side.

---

## 85. Authentication Architecture

Recommended:

```text
Access token
  short-lived
       +
Refresh token
  rotating/revocable
```

Store refresh-token/session metadata server-side so sessions can be revoked.

OAuth:

```text
Google OAuth
 → callback
 → validate identity
 → link/create account
 → create application session
```

Never trust frontend claims about identity or role.

---

## 86. Account Lifecycle

```text
REGISTERED
 → EMAIL_PENDING
 → ACTIVE
 → RESTRICTED
 → SUSPENDED
 → DELETED
```

Deletion must consider:

- financial records
- contracts
- disputes
- legal retention
- audit logs
- messages
- uploaded media
- consent records

Do not blindly cascade-delete historical financial information.

---

## 87. Privacy Architecture

Track:

```text
consents
privacy_preferences
data_exports
deletion_requests
retention_policies
```

Support:

```text
access/export
correction
deletion where legally applicable
marketing opt-out
account closure
```

Data minimization should be enforced at schema and API levels.

---

## 88. Secrets Management

Never store secrets in:

```text
Git
Docker image
frontend bundle
logs
database plaintext fields
```

Use environment/secret-management infrastructure.

Separate:

```text
development secrets
staging secrets
production secrets
```

Rotate credentials periodically and immediately after suspected exposure.

---

## 89. Infrastructure

Production topology:

```text
                         Internet
                            │
                        Cloudflare
                      WAF / DNS / TLS
                            │
                     Load Balancer
                            │
                ┌───────────┴───────────┐
                │                       │
             Web/CDN                 API tier
                                        │
                         ┌──────────────┼──────────────┐
                         │              │              │
                      API #1         API #2         API #N
                         │              │              │
                         └──────────────┼──────────────┘
                                        │
                          ┌─────────────┴─────────────┐
                          │                           │
                     PostgreSQL                    Redis
                    primary/replica             HA/cache
                          │                           │
                     Backups                    BullMQ queues
                                                      │
                                               ┌──────┴──────┐
                                               │             │
                                            Worker #1     Worker #N

External:
  Object Storage/CDN
  Payment Providers
  Email
  Social APIs
  AI Providers
  Analytics/Warehouse
  Monitoring
  Off-site Backups
```

A single VPS can host a smaller deployment, but the application must not be architecturally coupled to it.

---

## 90. Environment Strategy

Use at least:

```text
local
development
staging
production
```

Production data must never be used casually in development.

Environment-specific:

- databases
- Redis
- secrets
- payment credentials
- OAuth credentials
- storage buckets
- domains
- email providers

---

## 91. CI/CD

```text
Pull Request
 ↓
Lint
 ↓
Typecheck
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Security Scan
 ↓
Build
 ↓
Docker Image
 ↓
Migration Validation
 ↓
Staging Deploy
 ↓
Smoke / E2E Tests
 ↓
Approval
 ↓
Production Deploy
 ↓
Health Checks
 ↓
Monitoring
```

Use immutable image tags based on commit SHA.

Never deploy only `latest`.

---

## 92. Database Migration Strategy

For risky schema changes:

```text
Expand
 ↓
Deploy compatible code
 ↓
Backfill
 ↓
Switch reads/writes
 ↓
Validate
 ↓
Contract
```

Avoid destructive migrations during the same deployment that first depends on the changed schema.

Always maintain a recovery plan.

---

## 93. Disaster Recovery

Define:

```text
RPO — acceptable data loss
RTO — acceptable recovery time
```

Back up:

```text
PostgreSQL
critical object metadata
infrastructure configuration
migration history
```

Object media should rely on durable object storage with versioning/retention where appropriate.

Perform actual restore drills.

A backup that has never been restored is not a proven backup.

---

## 94. Horizontal Scaling

Scale in this order:

```text
1. SQL/index optimization
2. Connection pooling
3. Cache
4. Dedicated workers
5. API replicas
6. Search projection
7. Read replicas
8. Analytics warehouse
9. Specialized services
```

Extract a service only when there is a measurable reason:

- independent scaling
- operational isolation
- team ownership
- reliability boundary
- technology requirement

---

## 95. Future Microservice Seams

Possible future extraction boundaries:

```text
Payments
Notifications
Search
Messaging
Media Processing
Analytics
AI
```

Do not extract:

```text
creator
campaign
offer
contract
deliverable
```

too early if their workflows are tightly transactional.

Keep domain interfaces clean so extraction is possible later.

---

## 96. Frontend Production Architecture

Recommended:

```text
src/
  app/
    router/
    providers/
    config/
    auth/
  features/
    auth/
    creator/
    business/
    campaigns/
    applications/
    messaging/
    offers/
    contracts/
    deliverables/
    payments/
    payouts/
    disputes/
    analytics/
    notifications/
    admin/
  components/
  pages/
  hooks/
  lib/
  stores/
  types/
  validation/
```

Use:

```text
TanStack Query → server state
Zustand → small client state
React Hook Form → forms
Zod → shared validation
```

Do not duplicate server business rules in the frontend.

Frontend validation improves UX; backend validation provides security.

---

## 97. Admin Architecture

Admin must be a separate privileged application surface or strongly isolated route/module.

```text
Admin
 ├── User management
 ├── Creator verification
 ├── Business verification
 ├── Campaign moderation
 ├── Payment monitoring
 ├── Payout monitoring
 ├── Disputes
 ├── Reports
 ├── Fraud
 ├── Content moderation
 ├── Audit
 └── System health
```

High-risk financial actions require explicit permission and audit logging.

---

## 98. Support Architecture

Support agents should not automatically receive financial/admin privileges.

Support can:

```text
view allowed customer context
create support cases
communicate
request escalation
```

Finance/admin permissions remain separate.

---

## 99. Feature Flags

Use feature flags for controlled rollout:

```text
feature_flags
feature_flag_rules
```

Examples:

```text
ai_matching
new_search
affiliate
new_checkout
new_dashboard
```

Never use feature flags as a security boundary.

---

## 100. Configuration Architecture

Separate:

```text
environment secrets
application configuration
feature flags
business configuration
```

Business-configurable values should live in the database where appropriate:

```text
platform fee
campaign limits
file limits
notification rules
review window
```

Changes should be audited.

---

## 101. Complete Project Structure

Recommended monorepo:

```text
repo/
├── apps/
│   ├── web/
│   ├── api/
│   ├── worker/
│   └── admin/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── validation/
│   ├── config/
│   └── eslint-config/
│
├── infra/
│   ├── docker/
│   ├── nginx/
│   ├── terraform/
│   └── monitoring/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   └── compliance/
│
├── .github/
│   └── workflows/
│
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## 102. Backend Module Structure

Each domain should follow:

```text
modules/
  contracts/
    domain/
      entities/
      value-objects/
      events/
      rules/
    application/
      commands/
      queries/
      services/
    infrastructure/
      repositories/
      providers/
    presentation/
      controllers/
      dto/
```

For smaller modules, this can be simplified without losing domain boundaries.

Controllers remain thin.

---

## 103. Testing Strategy

Testing must cover four levels:

### Unit

- state transitions
- pricing
- permissions
- fee calculation
- eligibility
- revision limits

### Integration

- PostgreSQL
- Redis
- payment adapters
- repositories
- authorization

### E2E

```text
Signup
 → Verification
 → Profile
 → Campaign
 → Application
 → Offer
 → Contract
 → Payment
 → Deliverable
 → Approval
 → Payout
 → Review
```

### Failure-path testing

Explicitly test:

- duplicate webhooks
- retries
- concurrent acceptance
- failed payment
- refund
- chargeback
- payout failure
- expired offer
- expired contract
- unauthorized resource access
- deleted/suspended user
- worker crash
- DB connection failure

---

## 104. Contract Tests for External Providers

Every payment provider adapter should have contract tests:

```text
create order
verify payment
refund
payout
webhook verification
status mapping
error mapping
```

Provider-specific statuses must be normalized into internal states.

---

## 105. Performance Targets

Define measurable targets before scale:

```text
P95 API read latency
P95 API mutation latency
P95 search latency
WebSocket message latency
queue processing latency
payment webhook processing latency
```

Do not optimize based on assumptions.

Load test:

- search
- messaging
- campaign browsing
- checkout
- webhook bursts
- file metadata operations

---

## 106. Business Metrics Architecture

Core marketplace metrics:

```text
registered creators
active creators
registered businesses
active businesses
creator activation
business activation
search → profile
profile → contact
contact → offer
offer → acceptance
acceptance → payment
payment → completion
completion → repeat hiring
GMV
take rate
creator earnings
dispute rate
refund rate
chargeback rate
```

The marketplace's most important metric remains:

```text
successful completed collaborations
```

---

## 107. SEO Architecture

Public pages should be indexable:

```text
creator profiles
public services
campaign/category pages
blog
landing pages
```

Private pages must be protected from indexing.

Use:

```text
canonical URLs
structured metadata
sitemap
robots rules
Open Graph
schema markup where appropriate
```

Do not expose private creator/business information for SEO.

---

## 108. CMS / Blog Architecture

If blog/content is included:

```text
posts
post_versions
categories
tags
authors
seo_metadata
```

Publishing workflow:

```text
DRAFT
 → REVIEW
 → PUBLISHED
 → ARCHIVED
```

Admin authorization controls publishing.

---

## 109. Data Export Architecture

Exports are asynchronous:

```text
User requests export
 ↓
Authorization
 ↓
Create export job
 ↓
Worker generates archive
 ↓
Upload private archive
 ↓
Short-lived download URL
 ↓
Expire archive
```

Never generate huge exports synchronously inside an API request.

---

## 110. Account Deletion

```text
Deletion request
 ↓
Verify user
 ↓
Check legal/financial retention
 ↓
Anonymize/delete eligible data
 ↓
Revoke sessions/tokens
 ↓
Remove social tokens
 ↓
Expire files where allowed
 ↓
Audit completion
```

Historical contracts/payment records may require retention.

---

## 111. Operational Runbooks

Create runbooks for:

```text
payment webhook outage
payment provider outage
payout failure spike
DB failure
Redis failure
queue backlog
storage outage
email outage
OAuth outage
security incident
data restoration
bad deployment
migration failure
```

Operations should not depend on tribal knowledge.

---

## 112. Production Readiness Checklist

### Identity
- [ ] Session revocation
- [ ] Refresh rotation
- [ ] MFA for admins
- [ ] OAuth security

### Marketplace
- [ ] Campaign lifecycle
- [ ] Applications
- [ ] Invitations
- [ ] Negotiation history
- [ ] Contract snapshots

### Money
- [ ] Provider adapter
- [ ] Webhook verification
- [ ] Idempotency
- [ ] Refunds
- [ ] Chargebacks
- [ ] Payout reconciliation
- [ ] Ledger

### Trust
- [ ] Verification
- [ ] Moderation
- [ ] Fraud
- [ ] Disputes
- [ ] Reviews

### Security
- [ ] BOLA protection
- [ ] Rate limiting
- [ ] CSRF
- [ ] CSP
- [ ] Signed files
- [ ] Secret management
- [ ] Dependency scanning

### Reliability
- [ ] Outbox
- [ ] Retries
- [ ] Dead-letter handling
- [ ] Backups
- [ ] Restore test
- [ ] Monitoring
- [ ] Alerts

### Platform
- [ ] Team permissions
- [ ] Notifications
- [ ] Search
- [ ] Analytics
- [ ] Feature flags
- [ ] Admin
- [ ] Support

---

## 113. Final Architecture Decision

The platform should **not** be designed as an MVP with features removed from the architecture.

Instead:

### Application architecture

**Production-grade modular monolith**

### Data

**PostgreSQL as the authoritative transactional database**

### Cache / async

**Redis + BullMQ + transactional outbox**

### Real-time

**WebSockets with durable PostgreSQL persistence**

### Files

**Private object storage with signed URLs**

### Payments

**Provider abstraction + webhook-driven state + reconciliation**

### Search

**PostgreSQL first, replaceable search adapter for OpenSearch later**

### AI

**AI gateway with deterministic constraints and human confirmation for high-risk actions**

### Analytics

**Event-driven analytics with a future warehouse boundary**

### Infrastructure

**Docker + Cloudflare + independently scalable API/worker topology**

### Security

**Server-side authentication, authorization, BOLA protection, audit logs, rate limits and secure file/payment handling**

### Reliability

**Idempotency + transactions + outbox + retries + reconciliation + backups**

### Scale

**Clear domain boundaries and extraction seams, without forcing microservices prematurely**

---

# Final Architecture Principle

> **Build the complete production architecture around the real paid creator collaboration lifecycle, while keeping implementation complexity proportional to actual scale.**

The critical loop is:

**Discovery → Communication → Offer → Payment → Delivery → Approval → Payout → Review**

Every platform capability should support that loop, protect its integrity, or provide measurable business value.

---

# Part II: Detailed Platform Flows & Feature Specifications

---

## 37. Creator / Influencer Platform Flow

### 37.1 Main Website Entry
The header features a prominent, clear **Get Started** button.
- Flow: `Get Started → Continue with Brand | Continue with Creator`
- Selecting **Creator** launches the creator onboarding journey.

---

### 37.2 Creator Introduction Page
A high-converting public landing page explaining the platform and encouraging creators to join:
- **Platform Overview:** What the platform does and how it bridges creators with top brands.
- **Discovery:** How creators find brand collaboration opportunities and get invited.
- **Monetization:** How creators earn guaranteed payments.
- **Campaign Types:** Sponsored posts, dedicated videos, reels, UGC, unboxing, affiliate deals.
- **Workflow & Escrow:** Step-by-step collaboration and safe escrow payout mechanics.
- **Benefits:** Retain 90% of earnings, no payment chasing, verified brand briefs.
- **Trust & Security:** 100% platform escrow guarantee, clear revision limits, contract protection.
- **Creator Success Stories:** Genuine creator testimonials and case studies.
- **CTA:** `Join as Creator / Get Started → Login or Sign Up`

---

### 37.3 Login & Signup Flow
#### Login
- Email / phone number and password
- Forgot password with reset token
- Quick social login (Google OAuth)
- Link to create new account

#### Signup
- First name & Last name
- Phone number
- Email address & Password
- Accept Terms of Service & Privacy Policy
- Flow: `Submit → Email Verification Code → Enter Code → Verify → Creator Account → Dashboard`

---

### 37.4 First Login & Profile Completion
Immediately after verification, creators are guided by a profile completion banner / modal:
`Complete Your Profile → Add Missing Information → Profile Ready`
- Profile photo & bio
- Category / niche selection
- Social accounts (Instagram, YouTube, TikTok, Twitter/X, LinkedIn)
- Verified followers and engagement rates
- Location & spoken languages
- Content packages / service tiers
- Starting rates and pricing
- Portfolio items & sample deliverables
- Availability status
- Payout information (UPI / Bank Account / Razorpay Route)

---

### 37.5 Creator Dashboard
Gives the creator a consolidated real-time command center:
- **Metrics & Performance:**
  - Profile completion percentage
  - Followers / views / reach aggregation
  - Average engagement rate
  - Creator rating & review score
  - Completed collaborations count
  - Active campaigns count
  - Pending campaign applications
  - Cancelled collaborations
  - Pending earnings in escrow
  - Available wallet balance
  - Unread messages and invitations
  - Recommended campaigns feed
- **Main Navigation Tabs:**
  `Dashboard | Campaigns | Invites | Wishlist | Affiliate & Earnings | Wallet | Messages | My Collaborations | Blog | Profile | Settings`

---

### 37.6 Campaigns Discovery
The primary discovery engine for creators to browse brand opportunities:
- Keyword search
- Category / niche filtering
- Platform filter (Instagram, YouTube, TikTok, etc.)
- Location filter
- Budget / compensation range
- Campaign type (Paid, Gifting, Affiliate)
- Deliverables required
- Submission deadline
- Eligibility criteria & follower requirements
- Sort order: *Newest / Relevant / Recommended*
- Flow: `Campaigns → Search/Filter → Campaign List → Campaign Detail → Apply or Wishlist`

---

### 37.7 Campaign Detail View
Comprehensive brief information:
- Brand identity & company profile
- Campaign objective & target audience
- Required content format & guidelines
- Platform and deliverable specifications
- Compensation / budget
- Submission & campaign deadlines
- Content usage rights
- Creator eligibility criteria
- Action CTAs:
  - **Apply to Campaign** (Submit pitch, proposed rate, and sample work)
  - **Add to Wishlist** (Save for later)
- Flow: `View Campaign → Apply → Application Submitted → Track Status`

---

### 37.8 Brand Invitations
Direct collaboration invites initiated by brands:
- Flow: `Invites → View Invitation → Review Details → Accept / Decline / Discuss`
- Display: Brand info, campaign details, offered compensation, deliverables, deadline, brand message, status (PENDING, ACCEPTED, DECLINED).

---

### 37.9 Wishlist & Saved Campaigns
- Flow: `Campaign → Wishlist → Saved Campaigns → Open → Apply`
- Expired briefs are clearly flagged or archived.

---

### 37.10 Application to Collaboration
- Flow: `Apply → Brand Reviews → Selected → Offer/Agreement → Accept → Active Campaign Workspace`
- Collaboration workspace contains: final brief, agreed deliverables, guaranteed escrow payment, deadline, usage rights, integrated chat, submission portal, and revision tracker.

---

### 37.11 Content Submission & Revisions
- Flow: `Active Campaign → Create Content → Submit Deliverable → Brand Review → Approved OR Revision Requested`
- Per-deliverable cards with submission timestamp and deadline.
- Media upload (video/image) or direct live link submission.
- Revision feedback history preserved per iteration.
- Resubmission support within agreed contract revision limits.
- Flow upon approval: `Approved → Campaign Completed → Escrow Payment Released to Wallet`

---

### 37.12 Affiliate & Earnings
- Real-time revenue tracking: Daily, Monthly, Yearly, Total.
- Metrics: Orders / conversions, commission earned, pending commission, available commission.
- Affiliate performance breakdowns per campaign link.

---

### 37.13 Creator Wallet
- Available balance (ready for withdrawal)
- Pending balance (funds currently secured in escrow)
- Lifetime gross earnings
- Withdrawal flow: `Completed Collaboration → Payment Available → Wallet → Withdraw → Payout`
- Payout method selection (UPI VPA, Bank NEFT/IMPS, Razorpay Route)
- Complete transaction and withdrawal ledger with audit statuses.

---

### 37.14 Profile & Settings
- Personal information & credentials
- Profile photo, headline, and bio
- Connected social accounts & verification badges
- Niches & tags
- Services, pricing packages, and turnaround time
- Portfolio showcase (videos, reels, images)
- Availability toggle (Available for work / Fully booked)
- Notification preferences (Email, In-App)
- Password management & security

---

### 37.15 Payout Setup
Supports two distinct creator profiles:
1. **Individual Creator Profile:** PAN / Tax ID, UPI ID (VPA), or personal bank account.
2. **Registered Business Profile:** Company name, GSTIN / Business Tax ID, corporate bank account.
- Payout method selection & verification status.

---

### 37.16 Creator Blog
Allows creators to publish content to boost SEO, credibility, and platform discoverability:
- Flow: `Blog → My Posts → Create Post → Draft → Publish → Edit/Delete`
- Fields: Title, featured image, markdown content, category/tags, publication date, meta description.

---

### 37.17 Creator Notifications
Instant alerts for:
- New campaign recommendations matching niche
- Direct brand invitations
- Application accepted or declined
- New brand message
- Escrow funded / payment release
- Revision requests with feedback
- Approaching delivery deadlines
- Collaboration completed & review received
- Wallet withdrawal updates

---

### 37.18 Real-Time Messages
- Dedicated conversation thread per brand and campaign context.
- Integrated offer/agreement shortcuts.
- File and deliverable attachments.

---

### 37.19 Reviews & Reputation
Two-way feedback loop:
- Overall rating (1 to 5 stars)
- Specific scoring: Content quality, communication, timeliness
- Track completed collaborations and repeat collaboration rate
- Creators review brands on promptness, brief clarity, and fair revisions.

---

### 37.20 Support, Safety & Legal
- Help Center & FAQ
- Contact Support ticket system
- Report user / fraud report
- Collaboration dispute initiation
- Legal pages: Terms of Service, Privacy Policy, Escrow & Refund Policy, Content Guidelines.
- Account deletion and data export.

---

## 38. Brand Dashboard — Complete Flow Document

### 38.1 Purpose of the Brand Dashboard
The central operational command center for businesses:
`Dashboard → Discover Creators → Create Campaign → Collaborate → Approve → Pay → Measure → Reuse Successful Creators`

---

### 38.2 First Time Entering the Dashboard
- Personalized welcome message
- Profile completion progress bar
- Guided quick actions: Complete Brand Profile, Create First Campaign, Find Creators
- Subscription tier information and current usage limits
- Progressive onboarding (basic account setup first; payment methods, products, and team invitations configured as needed).

---

### 38.3 Dashboard Home (Overview)
- **Status Metrics:**
  - Active campaigns
  - Draft campaigns
  - Pending applications
  - Active creator collaborations
  - Upcoming deliverable deadlines
  - Completed collaborations
  - Cancelled / disputed collaborations
  - Total collaboration spend
  - Pending escrow payments
- **Interactive Widgets:**
  - Recent campaign performance summary
  - AI-recommended creators
  - Unread message threads
  - Profile completion indicator
  - Quick Action buttons: *Create Campaign, Find Creators, View Applications, View Messages*

---

### 38.4 Main Dashboard Navigation
- **Home:** Executive business overview and key metrics.
- **Campaigns:** Create, manage, and track campaign briefs.
- **Discover Creators:** Search, filter, compare, and shortlist creators.
- **Matching:** Rule-based and AI-powered creator recommendations for open campaigns.
- **Outreach:** Send direct invitations and custom sponsorship offers.
- **Applications:** Review, shortlist, message, accept, or decline applicant creators.
- **Messages / Inbox:** Real-time messaging with campaign and contract context.
- **Collaborations:** Live contract workspace for active and completed deliverables.
- **Analytics:** Comprehensive ROI, spend, reach, engagement, and cost-per-result analytics.
- **Affiliate:** Manage performance-based affiliate creator campaigns.
- **Products:** Manage product catalog and link SKUs to briefs.
- **Creator Network:** CRM for saving, organizing, tagging, and re-engaging creators.
- **Payments:** Manage escrow deposits, invoices, payment history, and refunds.
- **AI Assistant:** Generate briefs, refine outreach messages, and analyze campaign performance.
- **Settings:** Company details, team members & roles, billing, plans, and integrations.

---

### 38.5 Campaigns Management
- Filter by status: *All, Draft, Active, Pending, Completed, Cancelled, Archived*
- Displays: Campaign budget, creator count, applications received, deadlines, and live status.

---

### 38.6 Create Campaign Flow
Structured multi-step wizard:
`Create Campaign → Goal → Product → Creator Requirements → Deliverables → Budget → Timeline → Brief → Review → Publish`
1. **Goal:** Brand awareness, conversions, UGC asset creation, product launch.
2. **Product:** Select from catalog or specify custom product/service.
3. **Creator Requirements:** Niche, platform, audience demographics, follower tier, minimum engagement rate.
4. **Deliverables:** Formats (Instagram Reel, TikTok Video, YouTube Dedicated, UGC Raw), count, guidelines.
5. **Budget & Timeline:** Total budget, per-creator pay, submission deadline, campaign launch date.
6. **Brief & Guidelines:** Do's and don'ts, mandatory talking points, call-to-action, content usage rights.
7. **Action:** *Save Draft* or *Publish to Directory*.

---

### 38.7 Discover Creators
- Deterministic search engine with 11 filters:
  - Niche / category
  - Platform (Instagram, YouTube, TikTok, Twitter/X, LinkedIn)
  - Location & language
  - Follower range (Nano, Micro, Mid, Macro)
  - Engagement rate threshold
  - Budget / starting rate
  - Content format
  - Creator rating & review count
  - Availability status
  - Verified trust badge
- Quick actions: *Save to Network, Send Message, Invite to Campaign, Make Direct Offer*.

---

### 38.8 Creator Matching Engine
- Automated matching for published brand briefs:
  - Niche alignment score
  - Audience demographic match
  - Platform fit
  - Budget compatibility
  - Historical delivery & rating score
- Match explanation card explaining why the creator is recommended.

---

### 38.9 Application Review Flow
`Campaign → Applications → Review Creator → Shortlist → Message → Accept / Decline`
- View creator pitch, portfolio, proposed fee, and match rating.
- Internal brand notes for team review.
- Accept application → launches offer agreement.

---

### 38.10 Direct Outreach & Invitations
- Direct creator invitation modal:
  - Select campaign brief
  - Personalized invitation note
  - Offered compensation & deliverable scope
  - Deadline & usage rights
- Tracks invite status: `INVITED → ACCEPTED / DECLINED / NEGOTIATING`.

---

### 38.11 Collaboration Workspace & Deliverable Review
- Real-time agreement tracking:
  `Offer Accepted → Fund Escrow → Active Collaboration → Content Submission → Review → Approve`
- Submissions displayed with video/image preview or external live links.
- Revision cycle: Brands can request adjustments with timestamped feedback.
- Approval triggers:
  1. Contract marked `COMPLETED`
  2. Escrow funds automatically disbursed to creator's wallet
  3. Prompts two-way review submission

---

### 38.12 Collaboration Spend & Financial Analytics
- Total creator spend & platform fee breakdown
- Monthly and annual spend curves
- Spend distribution by platform, campaign, and creator category
- Average cost per creator and cost per deliverable
- Pending escrow vs settled payouts vs refund history

---

### 38.13 Performance Analytics
- Aggregated campaign impressions, views, engagement rate, and click-throughs
- Top-performing creators ranked by engagement and deliverables
- Exportable CSV/PDF reports for marketing leadership

---

### 38.14 Product Catalog
- Product management: Name, high-res image, retail price, description, store link
- Assign products to campaigns for unboxing and dedicated review deliverables.
- Optional ecommerce store synchronization.

---

### 38.15 Creator Network (Brand CRM)
- Dedicated talent repository:
  - Favorites & VIP creators
  - Previously contracted creators
  - Custom organizational tags (e.g., `#top-converting`, `#fast-turnaround`)
  - Internal collaboration ratings and private notes
  - One-click re-hire for future campaigns

---

### 38.16 AI Assistant for Brands
Integrated assistant supporting:
- **Campaign Brief Writer:** Drafts high-converting campaign briefs from brief prompts.
- **Creator Match Explainer:** Analyzes why a creator is a good fit.
- **Outreach Generator:** Crafts personalized invitation messages.
- **Analytics Summarizer:** Explains campaign metrics in plain language.
- *Strict Safeguard:* AI does not autonomously commit funds, alter contract terms, or approve deliverables without human confirmation.

---

### 38.17 Brand Settings
- **Company Profile:** Name, logo, industry, website, social handles, about section.
- **Team Members:** Role-based permissions (Admin, Campaign Manager, Reviewer), member invitations.
- **Billing & Plans:** Subscription tier, invoices, saved payment methods.
- **Integrations:** Social platforms, analytics tracking, ecommerce connectors.
- **Creator Payment Settings:** Default payment provider, automatic receipt generation.

---

### 38.18 Complete End-to-End Brand Lifecycle
```text
Login → Brand Onboarding → Dashboard Home
  ├── Discover Creators → Filter → Profile → Save / Invite / Offer
  └── Create Campaign → Brief → Budget → Publish
        └── Review Applications → Shortlist → Accept
              └── Escrow Deposit → Active Collaboration
                    └── Creator Submits Content → Review / Revision
                          └── Approve Deliverable
                                ├── Escrow Disbursed to Creator
                                ├── Leave 5-Star Review
                                └── Save Creator to Network for Repeat Deals
```

