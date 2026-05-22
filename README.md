# SiteSnap

AI-powered construction progress tracking. Turn jobsite photos into structured progress reports, schedule alerts, and compliance docs.

## Quick Start

### One-command setup with Docker

1. Copy the environment file and set your secrets:

    cp .env.example .env

Edit .env with your values (especially JWT_SECRET and ANTHROPIC_API_KEY).

2. Build and run:

    docker compose up --build

3. Open http://localhost:3001

The app will:
- Start PostgreSQL
- Run Prisma migrations
- Build the React frontend
- Serve everything on port 3001

## Features

- **Smart Photo Timeline** — Auto-sorted by project, date, and location
- **AI Progress Detection** — Claude vision analyzes jobsite photos for progress, materials, and safety
- **Crew Daily Reports** — One-tap daily logs with AI-generated summaries
- **Client Share Portal** — Read-only links for client visibility, no login required

## Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **AI**: Anthropic Claude (claude-sonnet-4-6)
- **3D**: React Three Fiber

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Project detail |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/photos/project/:id | List photos |
| POST | /api/photos/project/:id | Add photo |
| POST | /api/ai/analyze-photo/:id | AI photo analysis |
| POST | /api/ai/generate-report/:id | AI report summary |
| POST | /api/share/project/:id | Generate share link |
| GET | /api/share/:token | Access shared project |
| GET | /api/health | Health check |

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret for JWT tokens |
| ANTHROPIC_API_KEY | Anthropic API key for AI features |
| NODE_ENV | production or development |
| PORT | Server port (default 3001) |