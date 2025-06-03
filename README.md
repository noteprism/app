# Noteprism

Starting as:
A comprehensive system health monitoring dashboard built with SvelteKit and PostgreSQL, featuring real-time metrics and historical uptime tracking.

Becoming:
A powerful idea capture and knowledge management system that combines the best of note-taking, task management, and content creation. Transform fleeting thoughts into structured content, tasks, and social media posts.

## Key Features
- **Quick Capture** - Instantly save ideas, thoughts, and tasks as digital sticky notes
- **Smart Organization** - Auto-categorize notes and suggest connections between related ideas
- **Task Transformation** - Convert notes into actionable tasks with priority scoring
- **Content Pipeline** - Transform notes into polished content for various platforms
- **Real-time Collaboration** - Share and collaborate on notes, tasks, and content
- **Multi-format Export** - Share to social media, docs, or task management systems

## Directory Documentation
- [/src](src/README.md) - Source code and application logic
  - [/src/lib](src/lib/README.md) - Shared libraries and utilities
    - [/src/lib/server](src/lib/server/README.md) - Server-side utilities
    - [/src/lib/ui](src/lib/ui/README.md) - UI system and components
      - [/src/lib/ui/components](src/lib/ui/components/README.md) - Reusable UI components
      - [/src/lib/ui/elements](src/lib/ui/elements/README.md) - Basic UI building blocks
  - [/src/routes](src/routes/README.md) - SvelteKit routes and pages
    - [/src/routes/api](src/routes/api/README.md) - API endpoints
      - [/src/routes/api/health](src/routes/api/health/README.md) - Health check endpoints
    - [/src/routes/ui](src/routes/ui/README.md) - UI system documentation
- [/prisma](prisma/README.md) - Database schema and migrations
- [/static](static/README.md) - Static assets (favicons, manifest, etc.)

## Root Files
- `package.json` - Project configuration and dependencies
- `svelte.config.js` - SvelteKit configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build tool configuration
- `.gitignore` - Git ignore patterns

## Features

### UI System
- Material You dynamic color system
- Comprehensive design tokens
- Reusable component library
- Living style guide at `/ui`
- Light/dark theme support

### System Monitoring
- Server health monitoring with memory usage tracking
- PostgreSQL database connection status and latency
- Manual status updates on page load and click
- Response time measurements for all services

### Historical Data
- Uptime tracking for multiple time periods (24h, 7d, 30d, 90d)
- Persistent storage of health check results
- Last 50 health checks for detailed analysis
- Uptime percentage calculations

### Modern UI
- Clean, responsive dashboard design
- Real-time status indicators
- Uptime percentage displays
- Service status bars
- Overall system health overview

## Prerequisites

- Node.js
- PostgreSQL
- npm

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure PostgreSQL:
- Username: postgres
- Password: 2255
- Database: noteprism

3. Initialize the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173 (or the next available port).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type-check the codebase
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

- `GET /api/health/server` - Check server health
- `GET /api/health/database` - Check database health
- `GET /api/health/history` - Get last 50 health checks

## Testing

The project uses Vitest for unit testing. To run tests:

```bash
# Run all tests
npx vitest

# Run specific test file
npx vitest src/lib/server/health.test.ts

# Run tests in watch mode
npx vitest --watch
```

Current test coverage:
- `measureLatency`: Timing measurement and error handling
- `checkDatabaseHealth`: Database connectivity and record creation
- `checkServerHealth`: Memory monitoring and health status
- `getHealthHistory`: Historical data retrieval and ordering
- More tests coming soon for API endpoints

## Tech Stack

- SvelteKit - Full-stack framework
- TypeScript - Type safety
- PostgreSQL - Data storage
- Prisma ORM - Database management
- Vite - Build tool

# Svelte + TS + Vite

This template should help get you started developing with Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
