# Soho Space — Proof-of-Execution Hiring Platform

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.12-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

**Soho Space** is a meritocratic, proof-of-execution hiring platform connecting startup founders with top-tier technical talent ("Alpha Builders"). Instead of reviewing static resumes, founders post skill-testing challenges with real bounties, while builders complete challenges to demonstrate verified execution, earn XP, and secure positions or cash rewards.

The platform operates on **two clear challenge tracks**:
- ⚡ **SOHO Weekly Challenges**: Released every Monday by Soho Space, completely free for all builders with no monthly limits to build XP and climb the Top 100 Leaderboard.
- 🎯 **Founder Challenges**: Real hiring & bounty challenges posted by startup founders.

---

## 📚 Documentation Portal

Detailed technical documentation is available in the [`docs/`](file:///d:/sohospace2/soho-proof/docs) directory:

- 📋 **[Product Requirement Document (PRD)](file:///d:/sohospace2/soho-proof/docs/PRD.md)**: Product vision, user personas, complete capability specifications, subscription tier quotas, monetization strategy, and growth playbook.
- 🏗️ **[System Architecture Design](file:///d:/sohospace2/soho-proof/docs/ARCHITECTURE.md)**: Top-level system topology, frontend/backend component structure, RBAC security model, and integration blueprints.
- 🗄️ **[Database Design Specification](file:///d:/sohospace2/soho-proof/docs/DATABASE_DESIGN.md)**: Cloud Firestore collection schemas, subscription lifecycle fields, ERD, and composite indexing strategy.
- 🔒 **[Firebase Structure & Security Rules](file:///d:/sohospace2/soho-proof/docs/FIREBASE_STRUCTURE.md)**: Detailed breakdown of Firestore security rules, helper functions, 7-day grace period enforcement, and dev setup.

---

## ⚡ Core Features

- 🎯 **Proof-of-Work Profiles**: Verified skill metrics, level calculation, challenge history, and viral sharing capabilities (`/profile/:id`).
- 🏆 **Gamified Talent Discovery**: Automated XP calculation, global Top 100 builder leaderboard (`/community`), and multi-domain skill categories (Tech, Growth, Hybrid, Design, Data).
- 💼 **Dual Portal & Tier System**:
  - **Founder Portal**: Post challenges, delete/cancel/stop active challenges, define weighted scoring criteria, review submissions, grade proof-of-work, message builders, and issue payouts.
    - *Free Tier*: 1 active challenge limit per month.
    - *Pro Tier*: Unlimited active challenges + 7-day grace period warning on subscription expiration before secondary challenges freeze.
  - **Builder Portal**:
    - *Free Tier*: **Unlimited** SOHO Weekly Monday challenges + **up to 4 Founder challenges** per month.
    - *Pro Tier*: **Unlimited** Founder challenges, verified builder badge, and direct outreach.
- 🛡️ **Admin Console (`/admin/*`)**: System overview metrics, builder & founder management, SOHO Space weekly drop publishing, challenge moderation, and waitlist management.
- 💳 **Monetization & Subscriptions**: Tiered plans (Starter vs Pro) powered by Dodo Payments webhooks with automated cycle tracking.
- 💬 **Direct Messaging**: In-app chat threads between founders and candidates.
- 📣 **Embedded Feedback**: Built-in MonkFeed widget integration for platform feedback and upvoting.


---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI (Radix UI primitives), Framer Motion, Recharts.
- **Backend / APIs**: Express 5 on Node.js / Vercel Serverless Functions (`server/index.ts`), Zod schema validation, Firebase Admin SDK.
- **Database & Auth**: Google Cloud Firestore, Firebase Authentication (Email/Password & Google OAuth).
- **Integrations**: Dodo Payments (Webhooks), MonkFeed Widget, PostHog Analytics.
- **Testing & Tooling**: Vitest, Playwright E2E, ESLint, PostCSS.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm` or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DISHA-ENTREXT3/soho-proof.git
   cd soho-proof
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and populate your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

   Ensure your `.env` contains:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Start the Local Backend Server** (Optional for webhooks / API testing):
   ```bash
   cd server
   npm install
   npm run dev
   ```

---

## 📜 Available Scripts

In the project root, you can run:

| Command | Action |
|---|---|
| `npm run dev` | Runs the React frontend app in development mode using Vite. |
| `npm run build` | Bundles the application for production in `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Lints project files with ESLint. |
| `npm run test` | Runs unit & component tests using Vitest. |
| `npm run seed:dev` | Seeds development challenges and sample data into Firestore. |

---

## 🏛️ Project Directory Structure

```
soho-proof/
├── docs/                      # Technical Documentation Portal
│   ├── ARCHITECTURE.md        # System Architecture & Topology
│   ├── DATABASE_DESIGN.md     # Firestore Schemas & Entity ERD
│   └── FIREBASE_STRUCTURE.md  # Firestore Security Rules & Indexes
├── src/                       # React Application Source
│   ├── components/            # Reusable UI & Widget Components
│   ├── data/                  # Static Data & Mock Definitions
│   ├── hooks/                 # Custom React Hooks (Auth, Challenges, etc.)
│   ├── lib/                   # Firebase, Auth Context, PostHog Init
│   ├── pages/                 # Public & Private Page Routes
│   ├── types/                 # TypeScript Interfaces & Types
│   └── App.tsx                # Main App Router & Provider Layout
├── server/                    # Express Backend & Webhook Server
│   └── index.ts               # Express API & Dodo Payment Webhooks
├── scripts/                   # Utility & Database Seeding Scripts
├── firestore.rules            # Security Rules for Cloud Firestore
├── firestore.indexes.json     # Composite Indexes for Cloud Firestore
└── package.json               # Dependencies & Scripts
```

---

## 🔒 Security & Rules Deployment

To deploy updated Firestore Security Rules and Indexes to Firebase:

```bash
firebase deploy --only firestore
```

---

## 📄 License

Private & Proprietary — Soho Space. All rights reserved.
