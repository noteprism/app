# Noteprism

**Add Sticky Notes, Create Anything.**

Capture every idea, shower thought, and task as a digital sticky note in Noteprism. Add your insights, categorize them, and see which to tackle first based on ease and impact. Then, transform these notes into prioritized to-do lists, LinkedIn posts, articles, product ideas—whatever you need to build from your thoughts.

🌐 **Live Sites:**
- [noteprism.com](https://noteprism.com) - Production
- [preview.noteprism.com](https://preview.noteprism.com) - Preview

## Architecture

This is a **full-stack monorepo** with separate frontend and backend services:

### 🎨 Frontend (`/web`)
- **Framework:** Remix with Vite
- **UI Library:** Radix UI Themes
- **Styling:** Built-in Radix themes with dark/light mode
- **Testing:** Vitest + Testing Library
- **Deployment:** Cloudflare Pages

### 🚀 Backend (`/api`) 
- **Runtime:** Node.js 22.14.0
- **Framework:** Express with TypeScript
- **Security:** Helmet, CORS, rate limiting, compression
- **Deployment:** Google Cloud Run

## 🚀 Quick Start

### Development

```bash
# Install all dependencies
npm install

# Start frontend (http://localhost:5173)
cd web && npm run dev

# Start backend (http://localhost:8080)  
cd api && npm run dev
```

### Building

```bash
# Build frontend
cd web && npm run build

# Build backend
cd api && npm run build
```

## 📦 Deployment
### Frontend → Cloudflare Pages
- **Production:** Deploys from `main` branch → `noteprism`
- **Preview:** Deploys from `preview` branch → `preview-noteprism`
- **Automation:** GitHub Actions (`.github/workflows/deploy.yml`)

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Backend → Google Cloud Run
- **Production:** Deploys from `main` branch → `api`
- **Preview:** Deploys from `preview` branch → `preview`
- **Automation:** Cloud Build triggers

**Features:**
- Auto-scaling based on traffic
- Request-based billing
- IAM authentication
- Dockerfile-based deployments

## 🛠 Tech Stack
### Frontend
- **Remix** - Full-stack React framework
- **Radix UI Themes** - Complete design system
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vitest** - Testing framework

### Backend  
- **Express** - Web framework
- **TypeScript** - Type safety
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - Request logging
- **Express Rate Limit** - DDoS protection

### Infrastructure
- **Cloudflare Pages** - Frontend hosting
- **Google Cloud Run** - Backend hosting
- **GitHub Actions** - CI/CD automation
- **Cloud Build** - Container builds

## 🔧 Environment Variables
### Frontend (`web/.env.local`)
```env
# API endpoints
VITE_API_URL=http://localhost:8080
VITE_API_URL_PROD=https://api-[hash].a.run.app
VITE_API_URL_PREVIEW=https://preview-[hash].a.run.app

### Backend (`api/.env`)
```env
# Server configuration
PORT=8080
NODE_ENV=development

# Add your API keys here
```

## 📁 Project Structure

```
noteprism/
├── api/                    # Backend Express API
│   ├── src/
│   │   └── index.ts       # Main server file
│   ├── Dockerfile         # Container config
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
├── web/                   # Frontend Remix app
│   ├── app/
│   │   ├── routes/        # Remix routes
│   │   └── root.tsx       # App root with Radix themes
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── remix.config.js    # Remix configuration
├── .github/
│   └── workflows/
│       └── deploy.yml     # Deployment automation
├── package.json           # Workspace configuration
└── README.md             # This file
```

## 🚦 Branch Strategy

- **`main`** - Production deployments
- **`preview`** - Staging/preview deployments
- **Feature branches** - Development work

Both `main` and `preview` branches trigger automatic deployments to their respective environments.

## 🔐 Authentication

The backend uses IAM authentication by default. The frontend communicates with the API using service account credentials stored in Cloudflare Pages environment variables.

## 📈 Monitoring & Logs

- **Frontend:** Cloudflare Analytics
- **Backend:** Google Cloud Logging
- **Build Logs:** GitHub Actions + Cloud Build

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally
4. Push to `preview` branch to test in staging
5. Create PR to `main` for production deployment

---

**Happy building! 🚀**