# 🎬 CineStream

**A modern, full-featured movie streaming platform** — discover, watch, download, and manage movies with a Netflix-grade experience. Built with React, TypeScript, Tailwind CSS, and Lovable Cloud.

---

## ✨ Features

### For viewers
- 🔐 **Secure authentication** — Email + password sign-in with full forgot-password / reset flow
- 🎞 **Browse & search** — Rich filter bar (genre, year, rating, language, quality, free/premium) with multiple sort options
- ▶️ **Inline video player** — Custom HTML5 player with play/pause, seek, mute, fullscreen, keyboard shortcuts, and live quality switching (1080p / 720p / 480p)
- ⬇️ **Multi-quality downloads** — Pick a quality, save the file straight to your device
- ❤️ **Personal watchlist** — Save favorites to `My List` with one click
- 👑 **Premium tier gating** — Premium-only titles upsell free users to the pricing page
- 🎬 **Movie detail pages** — Cast, director, rating, related titles, share & comment scaffolding
- 📨 **Contact form** — Validated submissions delivered to the admin inbox
- 📱 **Fully responsive** — Looks great on phones, tablets, and desktops
- 🧭 **Sticky, adaptive navbar** — Translucent over hero artwork, opaque while scrolling

### For admins
- 📊 **Dashboard** — Live stats: total movies, free vs premium split, total views/likes, average rating, watchlist saves, contact message count
- 🏆 **Top 10 most viewed** — Real-time popularity leaderboard
- ➕ **Add movies** — Upload thumbnails, backdrops, and per-quality video files directly from local storage *or* paste URLs (works with Drive share links, CDNs, etc.)
- 📚 **Catalog management** — Toggle premium/free status, delete titles
- 📥 **Inbox** — Read all contact form submissions with one-click reply via mailto

---

## 🎯 Use Case

CineStream is designed as a **branded streaming portal** suitable for:
- Indie creators or studios distributing their own catalog
- Educational/training platforms hosting curated video libraries
- Internal media libraries for organizations
- Subscription-based content businesses (with optional premium gating)

It ships everything needed to launch — auth, content management, payments scaffold, watchlists, and an admin dashboard — without a separate backend service.

---

## 👥 Target Audience

| Persona            | What they get                                                      |
| ------------------ | ------------------------------------------------------------------ |
| **End viewers**    | A polished, fast streaming UI with watchlists and downloads        |
| **Content admins** | A no-code dashboard for adding, organizing, and removing content   |
| **Indie creators** | A turnkey platform to publish video work with free/premium tiers   |
| **Developers**     | A clean, modular React codebase to fork and customize              |

---

## 🛠 Tech Stack

### Frontend
- ⚛️ **React 18** + **TypeScript 5** — Type-safe component architecture
- ⚡ **Vite 5** — Lightning-fast dev server and bundler
- 🎨 **Tailwind CSS v3** — Utility-first styling with a custom semantic design system (HSL tokens, gradients, glassmorphism)
- 🧩 **shadcn/ui** + **Radix UI** — Accessible, composable component primitives
- 🧭 **React Router v6** — Client-side routing
- 🔄 **TanStack Query (React Query)** — Server state, caching, and mutations
- ✅ **Zod** — Runtime schema validation for forms
- 🍞 **Sonner** — Toast notifications
- 🎭 **Lucide React** — Icon set
- 🎞 **Embla Carousel** — Movie sliders

### Backend (Lovable Cloud — managed Postgres + Auth + Storage)
- 🗄 **PostgreSQL** with Row-Level Security (RLS) on every user-scoped table
- 🔐 **Email + password authentication** with secure password recovery emails
- 📦 **Object storage** — Three buckets: `movie-thumbnails`, `movie-backdrops`, `movie-videos`
- ⚙️ **Edge Functions** — Serverless functions (Deno runtime) for transactional emails and admin operations
- 🛡 **Role-based access** — Admin gating via a SECURITY DEFINER function and a separate `user_roles` table

### Tooling
- 🧪 **Vitest** + Testing Library — Unit testing
- 🔍 **ESLint** + **oxlint** — Linting
- 📦 **Bun** — Fast package manager / runtime

---

## 🗃 Database Schema

| Table               | Purpose                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `movies`            | Catalog: title, description, thumbnails, video URLs per quality, type (free/premium), genre, rating, views, likes |
| `profiles`          | Per-user display name and avatar (auto-created on signup)        |
| `user_roles`        | Role assignments (admin / user) — separate from profile to prevent privilege escalation |
| `subscriptions`     | Plan tier and Stripe subscription state per user                 |
| `watchlist`         | Movies a user has saved to "My List"                             |
| `contact_messages`  | Public contact form submissions (admins read; anyone can submit) |

All sensitive tables enforce RLS — users only see their own data; admins are identified server-side.

---

## 🗂 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/            # Admin dashboard widgets (analytics, inbox)
│   ├── ui/               # shadcn/ui primitives
│   ├── FiltersBar.tsx    # Browse/search filter bar
│   ├── HeroBanner.tsx
│   ├── MovieCard.tsx
│   ├── MovieSlider.tsx
│   ├── Navbar.tsx        # Adaptive (translucent → solid on scroll) navbar
│   ├── Footer.tsx
│   └── VideoPlayer.tsx   # Custom HTML5 player with quality switcher
├── pages/                # Route components
│   ├── Index.tsx         # Home
│   ├── Browse.tsx
│   ├── SearchResults.tsx
│   ├── MovieDetail.tsx
│   ├── Genre.tsx
│   ├── Free.tsx / Premium.tsx
│   ├── MyList.tsx        # Watchlist
│   ├── Auth.tsx          # Sign in / sign up / forgot / reset password
│   ├── Admin.tsx         # Hidden admin panel
│   ├── Contact.tsx
│   ├── Privacy.tsx / Terms.tsx
│   └── NotFound.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Session + admin check
│   ├── useMovies.ts      # Movie queries
│   └── useWatchlist.ts
├── lib/                  # Utilities
├── integrations/         # Auto-generated Supabase client + types
└── data/                 # Static data (genre list, fallback movies)

supabase/
├── functions/            # Edge functions (Deno)
└── migrations/           # SQL migrations

vercel.json               # SPA fallback so deep links work after refresh
```

---

## 🔐 Security Model

- **RLS-first**: Every user-scoped table has explicit RLS policies — users can only read/write their own rows
- **Admin separation**: Admin checks happen server-side via a SECURITY DEFINER function; admin status is never trusted from the client
- **No secrets in the client**: Only the publishable Supabase key is shipped to the browser; the service role key lives only in edge functions
- **Validated inputs**: All forms validated client-side with Zod *and* enforced server-side via RLS and check constraints
- **Secure file uploads**: Storage buckets restricted by RLS — only admins can upload videos/thumbnails

---

## 🎨 Design System

CineStream uses a **fully tokenized design system** — all colors, gradients, shadows, and animations live in `src/index.css` and `tailwind.config.ts` as HSL CSS variables. Components reference semantic tokens (`bg-primary`, `text-foreground`, `gradient-cinematic`) rather than hardcoded colors, so the entire theme can be re-skinned by editing one file.

- 🌑 **Dark theme** by default (cinematic aesthetic)
- 💎 **Glassmorphism** surfaces (`.glass` utility)
- 🌈 **Cinematic gradient** accents on CTAs
- ✨ **Smooth animations** for fade-in, fade-up, hover lifts
- 📐 **Active-route indicators** in the navbar with animated underline

---

## 🚢 Deployment

This project is built with [Lovable](https://lovable.dev) and is deployment-friendly on any static host (Vercel, Netlify, Cloudflare Pages, etc.).

### Vercel (recommended)
1. Push the repo to GitHub
2. Import the project on Vercel
3. Vercel auto-detects Vite — no extra config needed
4. The included `vercel.json` rewrites all routes to `index.html`, so deep links like `/browse` or `/movie/:id` survive a hard refresh

### Lovable
1. Open the project in Lovable
2. Click **Publish** in the top-right
3. Optionally add a custom domain in **Project Settings → Domains**

Production builds are deployed automatically on every push — no CI configuration needed.

---

## 🧪 Local development

```bash
# install dependencies (bun is fastest, but npm/pnpm/yarn also work)
bun install

# start dev server
bun run dev

# type-check
npx tsc --noEmit

# production build
bun run build

# run tests
bun run test
```

---

## 🗺 Roadmap

Future enhancements being considered:
- 🎬 TV show / series support (seasons + episodes)
- 💬 Comments & reviews on movie pages
- ⭐ Per-user ratings (separate from watchlist)
- ⏯ "Continue Watching" with playback resume
- 🤖 Personalized recommendations
- 💳 Live Stripe checkout for premium tiers
- 📧 Branded transactional emails (welcome, password reset)
- 🔤 Subtitles & multi-audio tracks

---

## 📬 Contact

Use the in-app contact form (`/contact`) — submissions land directly in the admin inbox at `/admin → Inbox`.

---

## 📄 License

This project is provided as-is for personal and demonstration use. Please contact the project owner before using commercially.

---

Built with ❤️ on [Lovable](https://lovable.dev)
