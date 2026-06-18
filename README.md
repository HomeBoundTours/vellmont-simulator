# Vellmont Business Impact Simulator

A production-ready, client-facing business impact modeling platform for Vellmont Consulting.

## Overview

Helps business owners visualize the financial and operational impact of revenue growth, capacity improvements, operational consulting, and SOP/documentation initiatives. Designed for discovery calls, strategy sessions, and sales presentations.

**This is a Business Impact Modeling Platform — not an ROI calculator.** All outputs are user-generated scenario models for planning purposes only.

## Tech Stack

- **Next.js 16** (App Router, Static Export)
- **TypeScript** + **Tailwind CSS v4**
- **Recharts** — interactive data visualizations
- **Framer Motion** — smooth animations
- **jsPDF** — branded PDF report generation
- **idb** — IndexedDB local data persistence
- **PWA** — installable, works offline

## Features

- 7 tabs: Overview, Revenue Impact, Capacity Impact, SOP & Docs, Operational Efficiency, Service Bundle Builder, Executive Summary
- Client information capture included on all exported reports
- Save / Load / Delete assessments locally (IndexedDB — no backend)
- PDF report generation — professional branded consulting deliverable
- JSON and CSV data export
- Presentation Mode — input-free full-screen view for client calls
- PWA — installable on mobile and desktop, offline-capable
- Mobile-first responsive design

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production Build

```bash
npm run build
```

Output is in `out/` — fully static, no server required.

## Deployment

### Netlify
- Build command: `npm run build`
- Publish directory: `out`

### Vercel
```bash
npx vercel
```

### GitHub Pages
1. Run `npm run build`
2. Push `out/` contents to `gh-pages` branch
3. Enable GitHub Pages in repo settings

### Any Static Host
Upload `out/` to any CDN (Cloudflare Pages, AWS S3, etc.)

## Architecture

```
vellmont-simulator/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/             # Header, Navigation
│   ├── tabs/               # 7 assessment tab components
│   ├── ui/                 # KpiCard, SliderInput, NumberInput, SectionCard
│   ├── SimulatorApp.tsx
│   ├── ClientInfoForm.tsx
│   ├── SaveLoadModal.tsx
│   └── ExportModal.tsx
├── context/
│   └── AssessmentContext.tsx
├── lib/
│   ├── calculations.ts
│   ├── storage.ts          # IndexedDB layer
│   ├── defaults.ts
│   ├── pdfExport.ts        # jsPDF report generation
│   └── exportUtils.ts
├── types/
│   └── index.ts
└── public/
    ├── manifest.json       # PWA manifest
    ├── sw.js               # Service worker
    └── icons/
```

## Disclaimer

All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes.
