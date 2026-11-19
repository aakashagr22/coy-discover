# Coy Discover — Dating Experience

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Neo--Tactile_Romance-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-11_Tests_Passing-green?style=flat&logo=vitest)](https://vitest.dev/)

A production-minded, privacy-first swipe discovery feature built for Coy as a standalone Next.js App Router application.

Engineered strictly according to the **Coy SDE Intern Assignment** requirements and visually tailored to the approved **"Neo-Tactile Romance"** Stitch design system.

---

## Visual Showcase (Screenshots)

| 1. Main Profile Card | 2. Drag Gesture Feedback | 3. "It's a Match!" Celebration |
| :---: | :---: | :---: |
| ![Main Card](design/screenshots/01-discover-main-card.png) | ![Swipe Interaction](design/screenshots/03-swipe-interaction-states.png) | ![Match Celebration](design/screenshots/04-match-celebration-modal.png) |

| 4. Mutual Matches View | 5. Empty Feed State | 6. Blank Home Tab |
| :---: | :---: | :---: |
| ![Matches View](design/screenshots/05-matches-view.png) | ![Empty State](design/screenshots/06-empty-discover-state.png) | ![Blank Home](design/screenshots/02-home-tab-blank.png) |

---

## Project Overview

Coy Discover delivers a modern dating discovery experience while honoring Coy's core privacy guarantee. Users can explore high-quality profiles, swipe with responsive touch or desktop controls, and experience real-time match celebration moments exclusively when mutual attraction is established.

The application is implemented as an autonomous full-stack Next.js project using Route Handlers directly mounted at root routes (`/feed`, `/swipe`, `/matches`) with a robust SQLite database managed via Prisma ORM.

---

## Features

- **Blank Home Tab:** Intentional minimal placeholder tab honoring the assignment specification.
- **Swipe-Based Discovery:**
  - One profile card rendered at a time.
  - Native touch drag gestures on mobile (`drag="x"`) with smooth spring return and fly-out physics.
  - Physical tactile Pass (`✕`) and Like (`♥`) buttons on desktop.
  - Real-time `LIKE ♥` and `PASS ✕` response stamps with proportional opacity and angle during dragging.
- **Privacy-First Matching:**
  - One-sided incoming likes remain completely confidential on the server.
  - Mutual matches are created **only** when both users have liked each other.
- **Match Celebration Modal:** Instant modal screen showcasing confetti, floating doodles, overlapping avatars, shared passion badges, and direct navigation options.
- **Mutual Matches View:** Dedicated connection view displaying thumbnails, location, shared passion chips, and mutual match badges.
- **Tactile Empty State:** Custom sleeping Coy character illustration with a "Check Again" refresh trigger when no cards remain in the feed.
- **Full Persistence:** Swipes and matches persist reliably across page reloads using SQLite and Prisma.
- **Optimistic State with Auto-Rollback:** Card deck advances optimistically for zero input lag, automatically rolling back and notifying the user if a network or backend failure occurs.

---

## Technology Stack

| Layer | Technology | Purpose & Justification |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2 (App Router) | Modern server components and Route Handlers directly resolving to `/feed`, `/swipe`, `/matches`. |
| **Language** | TypeScript (Strict Mode) | Type safety across domain models, API DTOs, and component interfaces. |
| **Styling** | Tailwind CSS | Custom design tokens matching Neo-Tactile Romance palette (`#FF347D`, `#E9E0FF`, `#211B29`). |
| **Animations & Gestures** | Framer Motion | Smooth drag gestures (`drag="x"`), tactile physics, and celebration modals. |
| **Database & ORM** | SQLite + Prisma ORM | Zero-dependency local persistence with type-safe schema definitions and atomic transactions. |
| **Validation** | Zod | Runtime server-side validation for incoming swipe payloads. |
| **Testing** | Vitest | Fast test runner for privacy rules, business logic, and API route integration tests. |

---

## Project Architecture

The architecture enforces a clean separation of concerns between presentation, service orchestration, database access, and validation:

```text
[ Client Components ]
  ├── Header & SubNav       (Navigation & Active View Routing)
  ├── CardStack             (Framer Motion Gesture Engine)
  ├── ProfileCard           (Neo-Tactile Visual Card & Stamp Overlays)
  ├── MatchModal            (Celebratory Scrim & Avatar Bubbles)
  ├── MatchesView           (Mutual Connection Cards)
  └── EmptyState            (Sleeping Heart SVG & Feed Polling)
            │
            ▼ HTTP (fetch)
[ Route Handlers ]
  ├── GET  /feed            (Root App Router Endpoint)
  ├── POST /swipe           (Root App Router Endpoint with Zod Validation)
  └── GET  /matches         (Root App Router Endpoint)
            │
            ▼ Service Calls
[ Domain Service Layer (services.ts) ]
  ├── getFeedProfiles()     (Applies Exclusion Filter & Strips Inbound Like Metadata)
  ├── recordSwipe()         (Atomic Prisma Transaction & Reciprocal Matching)
  └── getMutualMatches()    (Canonical Pair Retrieval & Profile Hydration)
            │
            ▼ ORM
[ Prisma ORM & SQLite Database (dev.db) ]
  ├── User Table
  ├── Profile Table
  ├── Swipe Table           (Unique compound index on [swiperId, targetId])
  └── Match Table           (Canonical sorted pair on [userAId, userBId])
```

---

## Database Schema Explanation

Defined in [prisma/schema.prisma](prisma/schema.prisma):

```prisma
model User {
  id             String    @id @default(cuid())
  name           String
  createdAt      DateTime  @default(now())
  profile        Profile?
  swipesGiven    Swipe[]   @relation("SwiperUser")
  swipesReceived Swipe[]   @relation("TargetUser")
  matchesAsA     Match[]   @relation("UserA")
  matchesAsB     Match[]   @relation("UserB")
}

model Profile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  age           Int
  photoUrl      String
  bio           String
  cityOrCollege String
  interests     String   // Serialized JSON array of interest strings
  createdAt     DateTime @default(now())
}

model Swipe {
  id        String   @id @default(cuid())
  swiperId  String
  targetId  String
  action    String   // "like" | "pass"
  createdAt DateTime @default(now())
  swiper    User     @relation("SwiperUser", fields: [swiperId], references: [id], onDelete: Cascade)
  target    User     @relation("TargetUser", fields: [targetId], references: [id], onDelete: Cascade)

  @@unique([swiperId, targetId])
  @@index([swiperId])
  @@index([targetId])
}

model Match {
  id        String   @id @default(cuid())
  userAId   String
  userBId   String
  createdAt DateTime @default(now())
  userA     User     @relation("UserA", fields: [userAId], references: [id], onDelete: Cascade)
  userB     User     @relation("UserB", fields: [userBId], references: [id], onDelete: Cascade)

  @@unique([userAId, userBId])
  @@index([userAId])
  @@index([userBId])
}
```

### Key Schema Design Decisions:
1. **Compound Unique Index `@@unique([swiperId, targetId])`:** Guarantees idempotency. A user can only have one active swipe record per target profile.
2. **Canonical Pair Sorting on Match `[userAId, userBId]`:** When creating a match, the user IDs are sorted alphabetically (`[swiperId, targetUserId].sort()`). This prevents duplicate reversed match pairs (e.g. `A-B` vs `B-A`).
3. **Cascade Deletes:** Deleting a user safely cascades to their profile, swipes, and matches.

---

## Matching and Privacy Logic

### 1. The Coy Privacy Contract
Coy guarantees that incoming one-sided likes are never leaked:
- When `GET /feed` runs, `getFeedProfiles()` queries unswiped profiles and formats them using `formatProfile()`.
- Only public profile attributes (`id`, `userId`, `name`, `age`, `photoUrl`, `bio`, `cityOrCollege`, `interests`) are returned.
- Inbound swipe relations are never joined or serialized in the response.

### 2. Transactional Matching State Machine
When a user swipes on a profile via `POST /swipe`:
1. **Validation:** Zod validates that `targetUserId` is non-empty and `action` is strictly `"like"` or `"pass"`.
2. **Transaction Scope (`prisma.$transaction`):**
   - The user's swipe is recorded via `upsert`.
   - If `action === "pass"`, the transaction concludes immediately with `{ match: false }`.
   - If `action === "like"`, the transaction inspects the database for an existing reciprocal swipe from `targetUserId` towards `swiperId`.
   - If a reciprocal swipe exists with `action === "like"`, an atomic `Match` record is created, and the endpoint returns `{ match: true, matchedProfile }`.
   - If the target has not swiped or has passed, the endpoint returns `{ match: false }`.

```text
[ User Swipes ] ────► Action == "pass"? ────► (Record Swipe) ────► Return { match: false }
                             │
                            No ("like")
                             │
                             ▼
              [ Check Reciprocal Inbound Swipe ]
                             │
           ┌─────────────────┴─────────────────┐
           │                                   │
     Reciprocal Like Found?              No Inbound Like
           │                                   │
           ▼                                   ▼
  (Create Match Record)               (Record Swipe Only)
           │                                   │
           ▼                                   ▼
  Return { match: true }              Return { match: false }
```

---

## Installation & Local Setup

### 1. Prerequisites
- **Node.js:** v18.17+ or v20+ (v24 LTS verified)
- **Package Manager:** `pnpm` (recommended) or `npm`

### 2. Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd coy-discover

# Install dependencies
pnpm install
# or
npm install
```

### 3. Environment Variables
Create a local `.env` file based on [.env.example](.env.example):
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is set to your SQLite file location:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Database Migration & Seed Commands
Initialize the SQLite database schema and populate it with 32 realistic mock profiles:
```bash
# Push schema to SQLite
npx prisma db push

# Seed 32 profiles and 17 inbound likes
npx tsx prisma/seed.ts
```

Expected terminal output:
```text
Seeding database for Coy Discover...
Created Demo User: Alex (demo-user-alex)
Seeded 32 profiles successfully!
Pre-seeded 17 incoming likes towards demo user (demo-user-alex).
```

### 5. Run Development Server
```bash
pnpm dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development and Test Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Start Dev Server** | `pnpm dev` | Starts Next.js development server at port 3000 |
| **Run All Tests** | `pnpm test` | Runs the full Vitest suite (11 unit & integration tests) |
| **Run Tests in Watch Mode** | `pnpm test:watch` | Runs Vitest in interactive watch mode |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Strict static type validation |
| **Next.js ESLint** | `npx next lint` | Runs ESLint with Next.js Core Web Vitals config |
| **Production Build** | `pnpm build` | Compiles optimized static and dynamic production bundles |
| **Start Production Server** | `pnpm start` | Launches built production server |
| **Open Prisma Studio** | `pnpm db:studio` | Opens visual GUI for browsing database tables |

---

## API Reference Documentation

All endpoints are Next.js Route Handlers resolving directly at the root.

### 1. `GET /feed`
Returns unswiped profiles for the active demo user.

- **Request:** `GET /feed`
- **Response Headers:** `Content-Type: application/json`
- **Response (200 OK):**
```json
{
  "profiles": [
    {
      "id": "cm...01",
      "userId": "user-maya-24",
      "name": "Maya",
      "age": 24,
      "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "bio": "Coffee enthusiast, ceramicist on weekends, and chronic over-thinker about brutalist architecture. Looking for someone to explore hidden bookshops with.",
      "cityOrCollege": "Brooklyn, NY • Pratt Institute",
      "interests": ["Ceramics", "Modern Art", "Natural Wine", "Indie Cinema", "Vinyl Records"]
    }
  ],
  "remainingCount": 32
}
```
*Privacy Guarantee: The response strictly omits any indication of whether a profile has already liked the demo user.*

---

### 2. `POST /swipe`
Records a user swipe (`"like"` or `"pass"`) and determines if a mutual match occurred.

- **Request:** `POST /swipe`
- **Request Headers:** `Content-Type: application/json`
- **Body Schema (Zod):**
```json
{
  "targetUserId": "user-maya-24",
  "action": "like"
}
```
- **Response — Mutual Match (200 OK):**
```json
{
  "success": true,
  "match": true,
  "matchedProfile": {
    "id": "cm...01",
    "userId": "user-maya-24",
    "name": "Maya",
    "age": 24,
    "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "bio": "Coffee enthusiast...",
    "cityOrCollege": "Brooklyn, NY • Pratt Institute",
    "interests": ["Ceramics", "Modern Art", "Natural Wine", "Indie Cinema", "Vinyl Records"]
  }
}
```
- **Response — No Match or Pass (200 OK):**
```json
{
  "success": true,
  "match": false
}
```
- **Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "action": ["Action must be either 'like' or 'pass'"]
  }
}
```

---

### 3. `GET /matches`
Returns all mutual connections for the demo user.

- **Request:** `GET /matches`
- **Response (200 OK):**
```json
{
  "matches": [
    {
      "id": "cm...match01",
      "matchedAt": "2026-11-19T20:30:00.000Z",
      "profile": {
        "id": "cm...01",
        "userId": "user-maya-24",
        "name": "Maya",
        "age": 24,
        "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "bio": "Coffee enthusiast...",
        "cityOrCollege": "Brooklyn, NY • Pratt Institute",
        "interests": ["Ceramics", "Modern Art", "Natural Wine", "Indie Cinema", "Vinyl Records"]
      }
    }
  ],
  "count": 1
}
```

---

## Production Deployment & Persistence Guide

### The Ephemeral Storage Constraint
Serverless container platforms (e.g. Vercel, Netlify, AWS Lambda) feature ephemeral file systems. **Local SQLite databases (`file:./dev.db`) will be reset upon container restarts or cold starts.** 

For production deployment, use one of the following persistent architectures:

### Option A: Hosted PostgreSQL (Recommended for Serverless)
1. Provision a free PostgreSQL instance on [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/).
2. In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set your environment variable in your production host dashboard:
   ```env
   DATABASE_URL="postgresql://username:password@ep-host.region.neon.tech/neondb?sslmode=require"
   ```
4. Run `npx prisma db push` and `npx tsx prisma/seed.ts` via build hooks or deployment scripts.

### Option B: Docker Container with Persistent Volume Mount
If deploying to Railway, Fly.io, or a VPS with Docker:
1. Mount a persistent disk volume to `/app/data`.
2. Configure `DATABASE_URL="file:/app/data/production.db"`.
3. Swipes and matches will persist across container re-deployments.

---

## Assignment Compliance Verification Matrix

| # | Assignment PDF Requirement | Implementation Status | Verification Location |
| :-: | :--- | :---: | :--- |
| **1** | A blank Home tab | **PASS** | [src/components/BlankHome.tsx](src/components/BlankHome.tsx) |
| **2** | A working Discover tab | **PASS** | [src/app/page.tsx](src/app/page.tsx) |
| **3** | At least 30 seeded mock profiles | **PASS** | [prisma/seed.ts](prisma/seed.ts) (32 profiles) |
| **4** | Name, age, photo, bio, city/college, interests | **PASS** | [src/lib/types.ts](src/lib/types.ts) & [ProfileCard.tsx](src/components/ProfileCard.tsx) |
| **5** | Some profiles already liked demo user | **PASS** | [prisma/seed.ts](prisma/seed.ts) (17 pre-seeded likes) |
| **6** | One profile card at a time | **PASS** | [src/components/CardStack.tsx](src/components/CardStack.tsx) |
| **7** | Swipe right to like | **PASS** | [CardStack.tsx](src/components/CardStack.tsx) & [services.ts](src/lib/services.ts) |
| **8** | Swipe left to pass | **PASS** | [CardStack.tsx](src/components/CardStack.tsx) & [services.ts](src/lib/services.ts) |
| **9** | Drag gestures on mobile | **PASS** | Framer Motion gestures in [CardStack.tsx](src/components/CardStack.tsx) |
| **10** | Like and Pass buttons on desktop | **PASS** | [src/components/ActionButtons.tsx](src/components/ActionButtons.tsx) |
| **11** | Smooth animations & clear feedback | **PASS** | Dynamic LIKE / PASS stamps & tactile buttons |
| **12** | Swiped profile never appears again | **PASS** | Filtered query in [src/lib/services.ts](src/lib/services.ts) |
| **13** | Clear empty state | **PASS** | [src/components/EmptyState.tsx](src/components/EmptyState.tsx) |
| **14** | Matching only when both users liked | **PASS** | Atomic verification in [src/lib/services.ts](src/lib/services.ts) |
| **15** | "It's a match!" screen on mutual match | **PASS** | [src/components/MatchModal.tsx](src/components/MatchModal.tsx) |
| **16** | Matches view listing all mutual matches | **PASS** | [src/components/MatchesView.tsx](src/components/MatchesView.tsx) |
| **17** | Never expose incoming one-sided likes | **PASS** | Verified via privacy tests in [matching.test.ts](src/tests/matching.test.ts) |
| **18** | Persistence across page reloads | **PASS** | SQLite + Prisma schema verified across reloads |
| **19** | Direct endpoints (`/feed`, `/swipe`, `/matches`) | **PASS** | Root Next.js Route Handlers (`src/app/*/route.ts`) |

---

## License

This project is licensed under the MIT License.
