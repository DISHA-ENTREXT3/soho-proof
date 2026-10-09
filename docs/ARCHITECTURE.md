# System Architecture Design

## 1. Overview
**Soho Space** is a proof-of-execution hiring platform connecting startup founders with technical talent through challenge-based skills verification. Rather than relying on traditional resumes, founders post skill-testing challenges with rewards (hires, cash bounties, recognition), while builders submit verifiable proof of work to earn XP, level up, and land roles.

The system is built as a modern hybrid application combining a client-side rendered Single Page Application (SPA) built with Vite, React 18, and TypeScript, backed by Firebase (Authentication & Firestore) and an Express API server for webhooks and admin operations.

---

## 2. High-Level System Topology

```mermaid
graph TD
    Client["React 18 SPA (Vite + Tailwind + Shadcn UI)"]
    FirebaseSDK["Firebase Web SDK"]
    ExpressAPI["Express API Server (Vercel Serverless / Node.js)"]
    FirebaseAuth["Firebase Authentication"]
    FirestoreDB["Cloud Firestore Database"]
    FirebaseAdmin["Firebase Admin SDK"]
    DodoPayments["Dodo Payments (Subscription Webhook)"]
    MonkFeed["MonkFeed Widget (Feedback / Upvotes)"]
    PostHog["PostHog Analytics"]

    Client -->|Direct Read/Write| FirebaseSDK
    FirebaseSDK -->|Auth Tokens & Profiling| FirebaseAuth
    FirebaseSDK -->|Realtime Data & Queries| FirestoreDB

    Client -->|REST Requests| ExpressAPI
    ExpressAPI -->|Admin Mutations & Reads| FirebaseAdmin
    FirebaseAdmin --> FirestoreDB

    DodoPayments -->|POST /api/webhooks/dodo| ExpressAPI
    MonkFeed -->|Client Script Embed| Client
    Client -->|Event Telemetry| PostHog
```

---

## 3. Frontend Architecture

### 3.1 Tech Stack & UI Design System
- **Framework**: React 18 with Vite and TypeScript (Strict Mode).
- **Styling**: Tailwind CSS + Shadcn UI (Radix primitives) + Framer Motion.
- **Routing**: `react-router-dom` (v6) with nested routes, role-guarded layouts, and lazy-loaded page components (`React.lazy` + `Suspense`).
- **State & Data Fetching**:
  - `AuthContext`: Manages Firebase Auth user state, user profile snapshot, role state (`talent` vs `founder`), and subscription status (`starter` vs `pro`).
  - `@tanstack/react-query`: Handles client-side query caching and mutations.
  - Custom React Hooks: `use-challenges`, `use-submissions`, `use-messages`, `use-profile`, `use-payouts`.

### 3.2 Key Application Modules
1. **Public Surface**:
   - `/` - Value proposition, feature showcase, interactive challenge ticker.
   - `/pricing` - Dual-side subscription tiers (Founder Pro vs Builder Pro).
   - `/profile/:id` - Shareable public proof-of-work profiles.
   - `/auth` & `/login` - Role selection, email/password signup, and Google OAuth login.
   - Legal Compliance Pages (`/privacy`, `/terms`, `/cookies`, `/disclaimer`).

2. **Authenticated Workflows**:
   - **Role Guard**: `RequireAuth` wrapper ensuring logged-in status, `RequireRole` for role-specific access, and onboarding guard redirecting un-profiled users to `/onboarding`.
   - **Talent Dashboard** (`/dashboard/talent`): Explore bounties, active submissions, submission history, XP & level tracker.
   - **Founder Dashboard** (`/dashboard/founder`): Manage posted challenges, review pending submissions, grade proof-of-work, issue payouts, message builders.
   - **Direct Messaging** (`/dashboard/messages`): Real-time chat threads between founders and builders.
   - **Challenge Builder**: Multi-step wizard to publish new challenges with criteria weights and compensation details.

---

## 4. Backend Architecture & API Layer

### 4.1 Server Environment
- **Framework**: Express 5 on Node.js / Vercel Serverless Functions (`api/index.ts` -> `server/index.ts`).
- **Validation**: `zod` schemas for strict request payload validation.
- **Firebase Admin SDK**: Performs elevated operations (bypassing Firestore client rules when authorized), such as atomic server-side submissions, transactional counter updates, and webhook processing.

### 4.2 API Endpoints Matrix

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/challenges` | GET | Public | Fetches all open/active challenges ordered by creation date. |
| `/api/challenges/:id` | GET | Public | Fetches challenge details and associated submissions. |
| `/api/challenges` | POST | Founder | Validates schema (`Zod`) and creates a new challenge. |
| `/api/submissions` | POST | Builder | Submits proof-of-work and atomically increments participant count. |
| `/api/webhooks/dodo` | POST | Webhook Signature | Upgrades user to `pro` subscription upon `order.succeeded`. |
| `/api/founder-agent/message` | GET/POST | Optional | AI Assistant endpoint for automated founder queries & challenge assistance. |

---

## 5. Authentication & Authorization Security Model

### 5.1 Identity Management
- Authentication handled via **Firebase Authentication**.
- Supports Email/Password credentials and Google Social Sign-In.

### 5.2 Role-Based Access Control (RBAC)
- User role stored in Firestore user document (`/users/{userId}.role`).
- Roles:
  - `talent` (Builder): Submits work to challenges, earns XP, requests payouts.
  - `founder` (Employer): Posts challenges, grades submissions, messages candidates, issues payouts.
- Subscription Tiers:
  - `starter`: 1 active challenge limit for Founders, 2 submission limit for Builders.
  - `pro`: Unlimited challenges & submissions, direct messaging, verified badge.

---

## 6. Integrations & Third-Party Services

1. **Dodo Payments**:
   - Handles checkout and subscription management.
   - Triggers `POST /api/webhooks/dodo` on successful checkout to grant `pro` status in Firestore.
2. **MonkFeed Widget**:
   - Embeds user upvotes and feedback widget directly into the app layout.
3. **PostHog Analytics**:
   - Captures user interactions, challenge views, submission conversions, and onboarding funnels.
4. **Vercel**:
   - Deploys frontend SPA build and serverless backend API functions.
