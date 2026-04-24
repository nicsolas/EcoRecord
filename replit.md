# Workspace

## Overview

pnpm workspace monorepo using TypeScript. EcoSort - an Italian recycling sorting game with a global leaderboard and countdown to prize.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── ecosort/            # EcoSort frontend (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## EcoSort Game

**How it works:**
- Player enters their first and last name to start
- A random trash item appears with a 10-second countdown
- Player must click the correct bin (Organico, Vetro, Carta, Multimateriale, Indifferenziato)
- Correct answer = +10 points; wrong or timeout = 0 points
- Game goes through 10 items per session
- Score can be submitted to the global leaderboard
- Countdown timer shows days/hours/minutes/seconds until **20 maggio 2026 premiazione**

**Trash categories:**
- 🟤 Organico: food scraps, banana peels, coffee grounds, eggshells, fruit
- 🟢 Vetro: wine bottles, jam jars, beer bottles, glass jars, broken glasses
- 🔵 Carta: newspapers, cardboard boxes, magazines, paper bags, notebooks
- 🟡 Multimateriale: cola cans, plastic bottles, yogurt cups, plastic bags, tetrapak
- ⚫ Indifferenziato: cigarette butts, diapers, toothbrushes, chewing gum, vacuum bags

## API Endpoints

All routes at `/api`:
- `GET /api/healthz` - Health check
- `GET /api/game/config` - Game configuration (countdown deadline, time per item, points)
- `GET /api/scores?limit=20` - Leaderboard (sorted by bestScore)
- `GET /api/scores/player?firstName=X&lastName=Y` - Individual player score
- `POST /api/scores` - Submit score `{ firstName, lastName, score }`

## Database Schema

### scores table
- `id` (serial, PK)
- `first_name` (text, not null)
- `last_name` (text, not null)
- `total_score` (integer, default 0)
- `games_played` (integer, default 0)
- `best_score` (integer, default 0)
- `updated_at` (timestamp, default now)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Key Commands

- `pnpm run typecheck` — full type check
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/e-kosmos run dev` — run frontend
