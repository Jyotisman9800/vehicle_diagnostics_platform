OEM Diagnostics — Vercel Deploy

Overview
This project is a static React SPA (via CDN + Babel) that mirrors your Fleet Dashboard, Fleet Operators, Operator Details, and Vehicle Dashboard UIs. It can be deployed to Vercel with zero build configuration.

Quick Deploy Options
1) Using Vercel CLI (fastest from your machine)
- npm i -g vercel
- vercel           # creates a preview deployment
- vercel --prod    # promotes to production (your canonical URL)

2) Using GitHub/GitLab/Bitbucket
- Push this folder to a new repository.
- Go to vercel.com -> New Project -> Import the repo.
- Framework Preset: Other (or Static Site).
- Root Directory: . (project root)
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Deploy.

Notes
- vercel.json is provided to:
  - Serve index.html for any path (rewrites), so the SPA works even if users deep‑link to routes.
  - Cache static assets aggressively (styles.css, app.jsx).
- This SPA uses CDN React and in‑browser Babel for simplicity. For production performance you may later migrate to a proper build (Vite/Next.js) and remove Babel-in-browser.

Local Preview
- Just open index.html in your browser.

Routes
- #/dashboard
- #/fleet-operators
- #/fleet-operators/4
- #/vehicle-dashboard

