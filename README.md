# MathQuest

Interactive, proof-based mathematics learning workspace built with React, TypeScript, Tailwind CSS, MathJax 3 (SVG), and Firebase. Designed with a sharp-edged monochrome obsidian aesthetic, bilingual support (English & French), customizable per-problem timers, and offline-ready PWA capabilities.

---

## Core Features

### 1. Structured Proof-Based Curriculum
Practice is organized into **two curated tracks**, each split into **Basic** and **Advanced** tiers (12 total proof problems):

- **Numbers and Structures**
  - *Basic*:
    1. Sum of Squares by Mathematical Induction
    2. Kernel Subspace Proof & Null-Space Basis
    3. Spectral Orthogonality of a Symmetric Matrix
  - *Advanced* (locked until all Basic proofs in the track are solved):
    1. Constructive Modular Inverse via Bézout Proof
    2. Chinese Remainder Theorem Constructive Proof
    3. Nilpotent Jordan Splitting & Inductive Matrix Power

- **Analysis and Vectors**
  - *Basic*:
    1. Lipschitz Bound of Sine via Mean Value Theorem
    2. Cyclic Integration by Parts Proof
    3. Orthonormal Vector Projection & Gram-Schmidt Proof
  - *Advanced* (locked until all Basic proofs in the track are solved):
    1. Proof of the Gaussian Integral via Polar Reduction
    2. Constrained Extremum Proof via Lagrange & Cauchy-Schwarz
    3. Euler's Proof of the Basel Series $\zeta(2) = \pi^2/6$

### 2. Persistent Top Navigation
A sticky navigation bar remains visible across every screen and state with three dedicated panels:
- **Account** — Google Sign-In (`Firebase Auth`), language switcher (`EN` / `FR`), and default problem timer preference.
- **How It Works** — Overview of the proof methodology, gating rules, timer controls, and full rank progression ladder.
- **Performance & History** — Aggregate proof completion metrics, track breakdown, and next-rank promotion checklist.

### 3. Custom Per-Problem Timer
Every problem includes a dedicated clock bar allowing learners to choose their own pace:
- **Presets**: `Untimed` (stopwatch mode), `5m`, `10m`, `15m`, `25m`, `45m`
- **Fine tuning**: `-1` / `+1` minute controls (up to 180 minutes)
- **Preferences**: Configure a personal default duration in Account Preferences

### 4. Rank Progression Ladder (Rank 5 → Rank 1)
Instead of arbitrary points, mastery advances through five ranks based on verified proofs:

| Rank | Title (EN / FR) | Promotion Criteria |
| --- | --- | --- |
| **Rank 5** | Initiate / *Initié* | Starting rank (`0–1` proofs solved) |
| **Rank 4** | Apprentice / *Apprenti* | Verify at least `2` Basic proofs |
| **Rank 3** | Scholar / *Érudit* | Complete `1` full Basic tier + `4+` total proofs solved |
| **Rank 2** | Fellow / *Lauréat* | Complete both Basic tiers + `3` Advanced proofs (`9+` total) |
| **Rank 1** | Master / *Maître* | Solve all `12/12` curated proofs across both tracks |

### 5. MathJax 3 SVG & PWA Support
- Typesets inline and display LaTeX crisp and responsive on mobile, tablet, and desktop viewports (`MathJax 3` SVG output).
- Progressive Web App (`vite-plugin-pwa` + Workbox) caching fonts, MathJax, and static assets for offline use.
- Clean **MQ** geometric favicon, Apple touch icon, and maskable PWA icons.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS 4, `lucide-react`, `canvas-confetti`
- **Math Rendering**: MathJax 3 (`tex-svg.js`)
- **Backend / Dev Server**: Express (`server.ts`) with Vite middleware in development and `/api/tracks`, `/api/exercises`, `/api/health` endpoints
- **Auth & Persistence**: Firebase Authentication (Google Sign-In) + Cloud Firestore (`users/{uid}`) with local `localStorage` guest fallback
- **PWA**: `vite-plugin-pwa` + Workbox runtime caching

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation & Local Development
```bash
npm install
npm run dev
```
The Express + Vite development server starts on `http://localhost:3000`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express + Vite development server on port `3000` |
| `npm run build` | Build production static bundle into `dist/` |
| `npm start` | Serve production Express server (`server.ts`) |
| `npm run preview` | Preview built Vite bundle locally |
| `npm run lint` | Run TypeScript type-checking (`tsc --noEmit`) |
| `node scripts/generate-icons.js` | Regenerate all **MQ** PNG/ICO favicon & PWA icons in `public/` |

---

## Firebase Setup & Environment Variables

By default, the client reads Firebase configuration from `firebase-applet-config.json`. You can override any field via `VITE_*` environment variables (see `.env.example`):

```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_APP_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_FIRESTORE_DATABASE_ID=""
```

Ensure your deployment domain(s) are added to **Firebase Console → Authentication → Settings → Authorized domains** for Google Sign-In popups to succeed, and deploy `firestore.rules` to enforce per-user schema-validated read/write access on `users/{uid}`.

---

## Project Structure

```text
├── public/                 # Static MQ icons (SVG, ICO, Apple Touch, PWA PNGs) & _redirects
├── scripts/
│   └── generate-icons.js   # Pure Node PNG/ICO generator for MQ brand icons
├── src/
│   ├── components/         # UI panels (TopBar, TracksOverview, SolvingDeck, LockedLevelCard, etc.)
│   ├── contexts/           # AuthContext (Firebase + local fallback) & LanguageContext (EN/FR)
│   ├── data/               # Curated English & French proof exercises and tracks
│   ├── i18n/               # UI translation dictionaries (en / fr)
│   ├── lib/                # Firebase initialization & rank evaluation logic
│   ├── types/              # Shared TypeScript interfaces
│   ├── App.tsx             # Root application state & layout
│   └── index.css           # Tailwind entry & MathJax styling rules
├── firestore.rules         # Firestore security & field validation rules
├── netlify.toml            # Netlify build, redirect, and header config
├── server.ts               # Express server + API routes
└── vite.config.ts          # Vite + Tailwind + VitePWA configuration
```
