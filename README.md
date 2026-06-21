# ✨ Maison Lumière — Virtual Luxury Beauty Salon

> An immersive 3D virtual tour of a five-star beauty salon. Wander the floor, meet the artisans, and book your ritual — all from your browser.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-v1-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r184-000?style=flat-square&logo=threedotjs)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)

---

## 🏛️ Overview

**Maison Lumière** is a cinematic, scroll-driven virtual salon experience built with modern web technologies. Users explore a fully 3D-rendered luxury beauty salon, browse services across four ateliers, and complete a multi-step booking flow — all within a single-page application.

### Key Features

| Feature | Description |
|---|---|
| 🎥 **3D Virtual Tour** | Scroll-driven camera rig navigates through a complete salon scene built with React Three Fiber & Drei |
| 💫 **Cinematic Animations** | Scroll-reveal transitions, staggered fades, and a gentle camera sway for a premium feel |
| 💇 **Four Ateliers** | Hair Atelier · Nails Bar · Facial Suite · Apothecary — each with curated service menus |
| 📋 **Multi-Step Booking** | Select a service → pick date, time & artisan → enter contact info → receive confirmation |
| 📱 **Fully Responsive** | Mobile-first design with scrollable modals and touch-friendly interactions |
| 🔔 **Toast Notifications** | Real-time feedback via Sonner toasts on booking success/errors |
| ⚡ **SSR + Edge Ready** | TanStack Start with Nitro for server-side rendering, deployed to Vercel |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React meta-framework) |
| **UI Library** | [React 19](https://react.dev) |
| **3D Engine** | [Three.js](https://threejs.org) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + custom OKLCH design tokens |
| **UI Components** | [Radix UI](https://www.radix-ui.com) primitives (shadcn/ui pattern) |
| **Bundler** | [Vite 8](https://vite.dev) |
| **Server** | [Nitro](https://nitro.unjs.io) (Vercel preset) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski) |
| **Typography** | Cormorant Garamond + Inter (Google Fonts) |

---

## 📁 Project Structure

```
d:\Beauty
├── src/
│   ├── components/
│   │   ├── salon/
│   │   │   ├── SalonScene.tsx          # Full 3D scene — floor, walls, furniture, camera rig, hotspots
│   │   │   ├── ServiceOverlay.tsx      # Multi-step booking modal (select → details → confirmation)
│   │   │   └── useScrollProgress.ts    # Dual scroll progress hook (global + camera-specific)
│   │   └── ui/                         # Radix-based UI primitives (shadcn pattern)
│   ├── hooks/
│   │   └── use-mobile.tsx              # Mobile breakpoint detection hook
│   ├── lib/
│   │   ├── utils.ts                    # cn() utility for class merging
│   │   ├── error-capture.ts            # SSR error capture
│   │   ├── error-page.ts               # Fallback error HTML
│   │   └── lovable-error-reporting.ts  # Error reporting integration
│   ├── routes/
│   │   ├── __root.tsx                  # Root layout — fonts, meta, Toaster, shell
│   │   └── index.tsx                   # Landing page — hero, tour chapters, services, apothecary, footer
│   ├── router.tsx                      # TanStack Router configuration
│   ├── routeTree.gen.ts                # Auto-generated route tree
│   ├── server.ts                       # SSR server entry with error normalization
│   ├── start.ts                        # TanStack Start entry
│   └── styles.css                      # Global styles — OKLCH tokens, animations, utilities
├── vite.config.ts                      # Vite + TanStack Start + Nitro (Vercel preset)
├── vercel.json                         # Vercel deployment configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies and scripts
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Beauty

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at **http://localhost:8080/**

### Production Build

```bash
# Build for production (outputs to .output/)
npm run build

# Preview the production build locally
npm run preview
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format with Prettier
npm run format
```

---

## 🌐 Deployment (Vercel)

This project is pre-configured for **Vercel** deployment using the Nitro `vercel` preset.

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

### Option 2: Git Integration

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click **Deploy**

### Environment

No environment variables are required for the base deployment. The app is fully client-rendered with SSR support via Nitro.

---

## 📱 Booking Flow

The booking system is a 3-step wizard inside the `ServiceOverlay` modal:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. SELECT       │ ──→ │  2. DETAILS      │ ──→ │  3. CONFIRMED    │
│                 │     │                 │     │                 │
│  Browse & pick  │     │  Date / Time /  │     │  Confirmation   │
│  a ritual from  │     │  Artisan select │     │  code + summary │
│  the menu       │     │  + Contact info │     │  + toast notif  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Accessible from:
- **"Book Now"** button inside any service overlay
- **"Reserve"** button in the top navigation bar
- **Service cards** in the Services grid section
- **Hotspot labels** in the 3D scene
- **Apothecary product list** items

---

## 🎨 Design System

The visual identity uses a carefully curated **OKLCH color palette**:

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.14 0.005 60)` | Onyx base |
| `--foreground` | `oklch(0.96 0.01 80)` | Warm white text |
| `--primary` | `oklch(0.82 0.09 85)` | Champagne gold — CTAs, accents |
| `--accent` | `oklch(0.88 0.05 25)` | Pastel rose — highlights |
| `--muted-foreground` | `oklch(0.72 0.015 70)` | Secondary text |

Custom utilities: `.text-gold`, `.bg-gold-gradient`, `.shadow-luxe`, `.hairline`, `.grain`, `.shimmer`, `.float`, `.reveal`

---

## 📄 License

This project is private and not licensed for redistribution.

---

<p align="center">
  <em>Maison Lumière — Where every detail is a ritual.</em>
</p>
