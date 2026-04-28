# E-kosmos (Waste Sorter Challenge)

**E-kosmos** is an interactive, educational web application designed to teach users about proper waste sorting and environmental protection through engaging gameplay.

## 🌍 Overview

"Gioca, impara, proteggi l'ambiente" (Play, learn, protect the environment). This project provides a fun way to learn about recycling and sustainability. Users can play the waste sorting challenge and compete for high scores on the leaderboard.

## 🚀 Tech Stack

### Frontend
- **React** (with Vite)
- **TypeScript**
- **Tailwind CSS** for styling
- **Radix UI** primitives for accessible components
- **Wouter** for lightweight routing
- **Framer Motion** & **Canvas Confetti** for animations

### Backend
- **Node.js** & **Express**
- **Vercel Serverless Functions** for API hosting
- **Neon Database** (Serverless Postgres)
- **Drizzle ORM** for database interactions

## 📁 Project Structure

This project is structured as a monorepo using `pnpm` workspaces:

- `/artifacts/e-kosmos` - The React frontend application.
- `/api` - Express backend API routes, handling user scores and game logic.

## 🛠️ Setup & Installation

1. **Install dependencies:**
   Make sure you have `pnpm` installed, then run:
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   Copy the example environment file and add your database credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure your Neon Database connection string is set up properly.*

3. **Run Development Server:**
   ```bash
   pnpm run dev
   ```
   This will start both the frontend Vite server and the backend API (if configured in root scripts).

## 📜 Database Schema

The application uses PostgreSQL with three main tables:
- `users`: Tracks player usernames and details.
- `games`: Stores available game challenges.
- `scores`: Records user scores associated with specific games.

## 📝 License

This project is licensed under the MIT License.
