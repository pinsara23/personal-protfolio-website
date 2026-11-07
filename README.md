# Pinsara Sarathchandra Portfolio

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` to validate the production build.

## Editing content

- Personal details, links, interests, and skills live in `src/data/profile.json`.
- All project cards and detail pages are generated from `src/data/projects.json`.
- Add a project by copying an existing object, giving it a unique `id` and `slug`, and filling only details that are verified.
- Project media can be added under `public/images/projects/<slug>/`; reference real paths in the project's `images` array. Do not add fabricated screenshots or large raw videos.
- Add the CV at `public/documents/Pinsara_Sarathchandra_CV.pdf`.
- Set `NEXT_PUBLIC_LINKEDIN_URL` and `NEXT_PUBLIC_EMAIL` in `.env.local` when those details are ready, then wire them into `profile.json` or a future contact provider.

## Deployment

The app is ready for Vercel: import the repository, keep the default Next.js build settings, and add any public environment values. The portfolio deployment is independent of the distributed chat application's future Kubernetes deployment.

## Living Systems design layer

The visual system is centralized in `src/app/globals.css` using the `--bg`, `--surface`, `--line`, `--text`, `--muted`, `--accent`, `--cyan`, `--violet`, and `--amber` tokens. Adjust these variables to retheme the site without changing content.

Small interaction primitives live under `src/components/motion/`: the boot loader appears once per browser session, the command palette opens with `Ctrl/Cmd + K`, and the terminal easter egg opens with the backtick key. Particle rendering, cursor effects, and marquee motion disable themselves for reduced-motion users; the particle field also uses a lower mobile node count. The particle effect is intentionally plain canvas rather than a 3D dependency to keep the above-the-fold payload light.

## Compute Core background

The persistent `Compute Core` lives in `src/components/three/` and is dynamically loaded after hydration/idle time from the root layout. It uses React Three Fiber with a capped DPR, instanced vertex nodes, one connection line buffer, lightweight orbit rings, and no post-processing. Its colors are the existing `--accent` lime and `--cyan` tokens.

The wrapper derives a normalized scroll ref from the `hero`, `about`, `skills`, `projects`, and `contact` anchors. Adjust those stage anchors or the lerp values in `ComputeCore.tsx` to tune choreography. Detail routes switch to the dim corner pose. The effect is disabled for reduced motion, reduced to a lower node/DPR budget on mobile or low-power hardware, and falls back to a CSS core when idle loading or WebGL initialization fails. Set `.compute-canvas { display: none; }` in `globals.css` to disable the effect entirely.

Lenis was not present in the existing project, so the background uses passive native scroll listeners and refs rather than adding a second scrolling system.
