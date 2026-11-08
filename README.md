# Pinsara Sarathchandra — Portfolio

> A systems-minded portfolio for a computer engineering undergraduate building across software, AI, robotics, embedded systems, distributed computing, and HPC.

<p>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.7"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white" alt="React 18"></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js" alt="Three.js"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Deploy with Vercel"></a>
</p>

## Overview

This is a statically generated Next.js portfolio with:

- Case-study pages generated from structured project data
- A dark “Living Systems” visual language with lime accents and mono labels
- Motion primitives, a command palette, terminal easter egg, and responsive interactions
- A persistent, performance-conscious React Three Fiber “Compute Core”
- An interactive N-Queens playground backed by a configurable API
- An accessible contact form with client-side validation, Web3Forms delivery, and `mailto:` fallback

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Portfolio landing page and project highlights |
| `/about` | Academic background, interests, and engineering philosophy |
| `/skills` | Technical toolkit grouped by engineering discipline |
| `/projects` | Project index and filters |
| `/projects/[slug]` | Generated project case studies |
| `/playground/n-queens` | Step-by-step N-Queens solver visualization |
| `/contact` | Contact form and social links |

## Tech stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript with strict checking
- **UI:** React 18, Tailwind-compatible design tokens, custom CSS
- **Motion:** Framer Motion
- **Icons:** Lucide React
- **3D:** Three.js, React Three Fiber, and Drei
- **Contact delivery:** Web3Forms
- **Deployment:** Vercel-ready

## Quick start

### Requirements

- Node.js 18.17+ recommended
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Validate locally

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Environment variables

Copy the example file before local development:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

| Variable | Used by | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Contact page | Public Web3Forms access key used for browser-side submission |
| `NEXT_PUBLIC_API_URL` | N-Queens playground | URL of the FastAPI solver service |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional project configuration | LinkedIn URL configuration placeholder |
| `NEXT_PUBLIC_EMAIL` | Optional project configuration | Email configuration placeholder |

The contact form does not crash when `NEXT_PUBLIC_WEB3FORMS_KEY` is missing. It preserves the entered values and offers a direct `mailto:` fallback. Never commit `.env.local`.

For the N-Queens playground, run the solver separately and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Content and project data

Personal details, links, interests, and skills are stored in [`src/data/profile.json`](./src/data/profile.json).

Projects and generated case studies are stored in [`src/data/projects.json`](./src/data/projects.json). To add a project:

1. Copy an existing project object.
2. Give it a unique `id` and URL-safe `slug`.
3. Add only verified descriptions, metrics, links, and media.
4. Put project media in `public/images/projects/<slug>/`.
5. Reference the real media paths from the project’s `images` array.

The CV belongs at `public/documents/Pinsara_Sarathchandra_CV.pdf`.

## Interaction system

The portfolio includes several deliberately lightweight interactions:

- `Ctrl/Cmd + K` opens the command palette.
- The backtick key opens the terminal easter egg.
- The intro loader appears once per browser session.
- Particle rendering, cursor effects, marquee motion, and the 3D background adapt to reduced-motion preferences.
- The Compute Core loads after hydration/idle time and falls back when WebGL is unavailable.

The visual tokens live in [`src/app/globals.css`](./src/app/globals.css). The main palette is built around `--bg`, `--surface`, `--line`, `--text`, `--muted`, `--accent`, `--cyan`, `--violet`, and `--amber`.

## Deployment

The project can be deployed to Vercel with the default Next.js settings:

1. Import the repository into Vercel.
2. Add the required environment variables in the project settings.
3. Deploy with `npm run build`.
4. Configure `NEXT_PUBLIC_API_URL` if the N-Queens backend is deployed separately.

The portfolio frontend and the N-Queens solver are independently deployable.

## Repository layout

```text
src/
├── app/                 # App Router pages, metadata, and global styles
├── components/          # Shared UI, motion, and playground components
├── data/                # Profile and project content
└── lib/                 # API helpers and shared utilities
public/
├── documents/           # Downloadable documents
└── images/              # Project and portfolio media
```

## License

This repository is a personal portfolio. Contact the author before reusing project content, copy, or media.
