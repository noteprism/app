# Noteprism

A modern note-taking application with a beautiful Material Design 3 theme system.

## Features

- Material Design 3 theming with dynamic color generation
- Dark/Light mode support
- User authentication
- System health monitoring
- Real-time theme customization
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/noteprism.git
cd noteprism
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and other configuration
```

4. Start the development server
```bash
npm run dev
# or
pnpm dev
```

## Project Structure

- `/src` - Source code
  - `/lib` - Shared libraries and components
    - `/ui` - UI components and theme system
    - `/server` - Server-side utilities
    - `/stores` - Svelte stores
  - `/routes` - SvelteKit routes and pages
  - `/app.d.ts` - TypeScript declarations
- `/static` - Static assets
- `/tests` - Test files

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Theme System

The application uses Material Design 3's dynamic color system. Theme preferences are:
- Stored per user
- Synced across sessions
- Customizable through the UI System page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
