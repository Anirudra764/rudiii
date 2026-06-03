# 🎸 Rangrez: Premium Indian Fusion Band Platform & Booking Engine

Welcome to **Remix: Rangrez**, the ultimate visual and administrative portal for the world-renowned Indian Sufi-Rock Fusion band, **Rangrez**. This repository is highly optimized, modern, and **GitHub-ready**.

Designed with **React 19 + TypeScript + Vite + Tailwind CSS v4** on the front-end, and a robust **Express API Server** on the back-end.

---

## ✨ Outstanding Core Features

1. **🎸 Interactive Sufi-Rock Home Engine**: Immersion visualizes rich soundscapes, interactive audio players with custom track selection, responsive track wave visualization controls, and high-fidelity video reels.
2. **🎟️ Intelligent Admission Seat Booking Engine**: Includes structured admission levels with specific perks, a simulated SVG seat layout with live validation logic, interactive coupon codes (e.g., `RANGREZ20`), payment simulation gateway options, and auto-generated high-contrast downloadable tickety passes.
3. **🎭 Dual-Identity Simulation Mode (RBAC)**: Switch instantly in the Sandbox Simulator from a standard Fan to a Booking Admin, General Manager, or Super Administrator with proper authorization credentials.
4. **📊 Backstage Administration Command Console**: Oversee ticket status lists, modify music or gallery assets, configure band profiles, generate audit tracks, and address inquiry submissions.
5. **🛡️ Custom System Visual Alerts**: Handcrafted notification modals with smart color context mapping to indicate Success, Warning, or Info status.

---

## 🚀 Quick Start Guide

### 1. Installation

To install all required dependencies (such as Vite, Tailwind CSS elements, Express, and Lucide icons) locally:

```bash
npm install
```

### 2. Run in Development Mode

Lanches the full-stack server using `tsx` (TypeScript Executor for Node):

```bash
npm run dev
```

Your browser will automatically serve the applet on **`http://localhost:3000`**.

### 3. Build & Produce Standalone Artifacts

This executes Vite's client-side bundling, then builds the backend `server.ts` into a self-contained, high-performance, single CJS file in `/dist` using `esbuild`:

```bash
npm run build
```

### 4. Launches Standalone Production Server

Runs the compiled product directly with standard Node execution:

```bash
npm run start
```

---

## 🐙 Publishing to GitHub & Deploying

To push this exact directory structure as a shiny, pristine GitHub repository:

### 1. Initialize and Commit:
```bash
git init
git add .
git commit -m "feat: first production-ready release of Rangrez full-stack applet"
```

### 2. Connect Your Remote URL:
Create a new blank repository on [GitHub](https://github.com), then tie it to your local git setup:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
```

### 3. Push Command:
```bash
git push -u origin main
```

---

## 🧱 Project Directory Layout

```text
├── assets/                     # Media & photo archives
├── src/
│   ├── components/             # Sub-components, view sections, forms
│   │   ├── Navbar.tsx          # Dynamic responsive menu & identity swapper
│   │   ├── HomeHero.tsx        # Hero banner with integrated visualizer
│   │   ├── BookingSystem.tsx   # Tickets purchase wizard with seat selector
│   │   ├── AdminDashboard.tsx  # Central console for band administrators
│   │   └── ...
│   ├── App.tsx                 # Core parent entrance and UI controller
│   ├── index.css               # Global styling, Tailwind imports, custom theme
│   ├── types.ts                # Strict typescript schema representations
│   └── fallbackData.ts         # High-fidelity backup initial state
├── server.ts                   # Express server, local DB file sync, files uploads
├── package.json                # Project script files & dependencies list
└── tsconfig.json               # Config compiler flags
```

---

*This portal is designed to carry the true artistic and soulful vibe of Indian Sufi-Rock. Spread the music!* 🎶
