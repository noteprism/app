# NotePrism

## Documentation
- [Web Source Documentation](web/src/README.md)
  - [TypeScript Types](web/src/interface/types/README.md)
  - [Health Components](web/src/ui/health/README.md)
- [API Documentation](api/src/README.md)

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

## Running the Frontend Locally

1. Open a terminal and navigate to the `web` directory:
   ```sh
   cd web
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Vite development server:
   ```sh
   npm run dev
   ```
4. Open the local server URL (usually http://localhost:5173) in your browser.