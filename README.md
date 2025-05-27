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

### Cloudflare Pages Settings
- Build command: `cd web && npm install && npm run build`
- Build output directory: `web/dist`
- Root directory: `/`
- Framework preset: None

### Google Cloud Run (API)
- **Preview branch** deploys to: [https://preview-768383813386.us-central1.run.app](https://preview-768383813386.us-central1.run.app)
- **Main branch** deploys to: [https://api-768383813386.us-central1.run.app](https://api-768383813386.us-central1.run.app)
- Both are triggered by commits to their respective branches via Google Cloud Build.
- The Dockerfile for `/api` must be present and configured for Node.js 22.14.0 (see below).

### Dockerfile Requirements (API)
- Use Node.js 22.14.0 base image for both build and runtime stages.
- Must build TypeScript and run the compiled output from `dist/index.js`.
- Example Dockerfile is provided in `/api/Dockerfile`. 