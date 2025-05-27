# NotePrism

## Tech Stack

### Frontend (/web)
- Vite
- TypeScript
- Alpine.js
- Ionic Core

### Backend (/api)
- Express
- TypeScript

## Deployment

### Cloudflare Pages (Frontend)
- **Root directory:** `web`
- **Build command:** `npm install && npm run build`
- **Build output directory:** `dist`
- **Framework preset:** None

### Google Cloud Run (API)
- **Preview branch:** https://preview-768383813386.us-central1.run.app
- **Main branch:** https://api-768383813386.us-central1.run.app
- **Dockerfile:** `/api/Dockerfile` (Node.js 22.14.0) 