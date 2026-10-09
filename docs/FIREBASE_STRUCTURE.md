# Firebase Structure & Security Configuration

## 1. Overview
Soho Space relies on Firebase as its core cloud backend platform. This document outlines the Firestore collection rules, security enforcement logic, database indexes, authentication configuration, and local development environment setup.

---

## 2. Firebase Services Used
- **Firebase Authentication**: User identity, password credentials, Google OAuth, JWT tokens.
- **Cloud Firestore**: Primary NoSQL data store with document rules.
- **Firebase Admin SDK**: Privileged backend operations (`server/index.ts` & seeding scripts).

---

## 3. Firestore Security Rules Breakdown (`firestore.rules`)

The security model is defined declaratively using `rules_version = '2'`. It enforces strict role isolation, owner ownership controls, subscription tier quotas, 7-day grace period rules, and immutable protected fields.

### 3.1 Security Helper Functions
```javascript
function isAuthenticated() {
  return request.auth != null;
}

function getUserData() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
}

function isOwner(userId) {
  return request.auth.uid == userId;
}

function isPro() {
  return getUserData().subscriptionTier == 'pro';
}

function isFounder() {
  return isAuthenticated() && getUserData().role == 'founder';
}

function isAdmin() {
  return isAuthenticated() && (getUserData().role == 'admin' || request.auth.token.email.endsWith('@entrext.com'));
}

function isDev() {
  return isAuthenticated() && request.auth.token.email.endsWith('@entrext.com');
}
```

---

### 3.2 Collection Rule Specifications

#### `match /challenges/{challengeId}`
- **Read**: `allow read: if true;` (Publicly discoverable by guests, candidates, and founders).
- **Create**: Allowed for authenticated founders or admin.
  - `Admin`: Can create official SOHO Space weekly drops (`isSOHOChallenge == true`).
  - `Pro` founders: Unlimited challenge creations.
  - `Starter` (Free) founders: Restricted to 1 active challenge (`status == 'Open'`).
- **Update**: Allowed for challenge owner (founder) or admin. Founders can update metadata, change status to `Cancelled` or `Completed`, or stop/cancel their active challenge.
- **Delete**: Restricted to challenge owner (founder) or admins (`isOwner(resource.data.founderId) || isAdmin()`).

#### `match /submissions/{submissionId}`
- **Read**: `allow read: if true;` (Public proof-of-work profiles & leaderboards).
- **Create**: Allowed only for authenticated talent (builders).
  - `SOHO Space Challenges`: Unlimited free submissions for all builders to build rank & XP.
  - `Pro` builders: Unlimited founder challenge submissions.
  - `Starter` (Free) builders: Restricted to 4 founder challenge submissions per month (`monthlyFounderSubmissionsCount < 4`).
- **Update**:
  - Builders can update their own submission (`isOwner(resource.data.talentId)`).
  - Challenge owners (founders) can **only** edit review fields (`['status', 'score', 'feedback']`).
- **Delete**: Restricted to owner or admins (`isOwner(resource.data.talentId) || isAdmin()`).

#### `match /users/{userId}`
- **Read**: `allow read: if true;` (Public builder/founder profiles).
- **Create**: Allowed if authenticated and `request.auth.uid == userId`.
- **Update**:
  - Users can update their own profile fields.
  - **Protection**: Users are blocked from self-modifying `subscriptionTier`, `role`, or `gracePeriodEnd` keys (`!request.resource.data.diff(resource.data).affectedKeys().hasAny(['subscriptionTier', 'role', 'gracePeriodEnd'])`). Pro upgrades and subscription lifecycle state changes are strictly gated through server-side payment webhooks and admin controllers.

#### `match /messages/{messageId}`
- **Read**: Only participants (`founderId == auth.uid || builderId == auth.uid` or `isAdmin()`).
- **Create**: Validated sender matching authenticated identity and user role.
- **Update / Delete**: `allow update, delete: if false;` (Immutable audit trail).

#### `match /payouts/{payoutId}`
- **Read**: Pro users, involved founder/builder, or admin.
- **Create**: Authenticated founders for their own challenges.
- **Update**: Restricted to modifying payout state (`['status', 'transferReference', 'payoutNotes', 'paidAt']`).

#### `match /waitlist/{waitlistId}`
- **Read**: Admin only (`isAdmin()`).
- **Create**: Allowed for all users (public email capture from Hero).
- **Update / Delete**: Admin only (`isAdmin()`).

---

## 4. Database Indexing Configuration (`firestore.indexes.json`)

To support fast dashboard sorting without client-side memory overhead:

```json
{
  "indexes": [
    {
      "collectionGroup": "challenges",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "founderId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "xp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 5. Development & Seeding Setup

### 5.1 Environment Variables Setup
Create `.env` in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5.2 Seeding Script
Populate development challenges and test data using:
```bash
npm run seed:dev
```
This executes `scripts/seed-dev.js` using Firebase Admin SDK credentials.

