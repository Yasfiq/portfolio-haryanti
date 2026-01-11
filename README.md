# 🎨 Portofolio Haryanti

> Modern portfolio website for a Graphic Designer & Content Creator, built with a headless CMS architecture.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs)](https://nestjs.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.7-000?logo=turborepo)](https://turborepo.com/)

## 📋 Overview

This project is a professional portfolio website featuring:
- **Portfolio Website** (`apps/web`) - Public-facing portfolio with smooth animations
- **CMS Admin** (`apps/cms`) - Content management system for easy updates
- **Backend API** (`apps/api`) - RESTful API powering both frontends

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, TailwindCSS 3, GSAP, Lenis |
| **Backend** | NestJS 11, Prisma 6, PostgreSQL |
| **Auth** | Supabase Authentication |
| **Storage** | AWS S3 |
| **Monorepo** | Turborepo, pnpm |

## 📁 Project Structure

```
portofolio-haryanti/
├── apps/
│   ├── web/          # Portfolio frontend (Port 3000)
│   ├── cms/          # Admin CMS (Port 3001)
│   └── api/          # Backend API (Port 3002)
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── ts-types/     # Shared Zod schemas
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
└── turbo.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- PostgreSQL database (or Supabase)
- AWS S3 bucket

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portofolio-haryanti

# Install dependencies
pnpm install

# Setup environment variables (copy and edit .env.example files)
cp apps/api/.env.example apps/api/.env
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env

# Push database schema
pnpm --filter @repo/database db:push

# Seed database (optional)
pnpm --filter @repo/database db:seed
```

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter web dev      # Portfolio (localhost:3000)
pnpm --filter cms dev      # CMS (localhost:3001)
pnpm --filter api dev      # API (localhost:3002)
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | TypeScript type checking |

## 🗄 Database Commands

```bash
# Generate Prisma client
pnpm --filter @repo/database db:generate

# Push schema to database
pnpm --filter @repo/database db:push

# Run migrations
pnpm --filter @repo/database db:migrate

# Open Prisma Studio
pnpm --filter @repo/database db:studio

# Seed database
pnpm --filter @repo/database db:seed
```

## 🔐 Environment Variables

### apps/api/.env
```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="..."
RESEND_API_KEY="..."
WEB_URL="http://localhost:3000"
CMS_URL="http://localhost:3001"
```

### apps/cms/.env
```env
VITE_API_URL="http://localhost:3002/api"
VITE_SUPABASE_URL="https://..."
VITE_SUPABASE_ANON_KEY="..."
```

### apps/web/.env
```env
VITE_API_URL="http://localhost:3002/api"
```

## ✨ Features

### Portfolio Website
- 🎯 Smooth scroll with Lenis
- 🎨 GSAP animations
- 📱 Fully responsive design
- 🔍 SEO optimized with React Helmet
- ⚡ Fast loading with Vite

### CMS Admin
- 🔐 Supabase authentication
- 📝 Full CRUD for all content
- 🖼 Image upload with cropping
- 📊 Dashboard analytics
- 🔄 Drag & drop reordering
- 📱 Offline detection

### Backend API
- 🛡 Helmet security headers
- ⏱ Rate limiting (100 req/min)
- ✅ DTO validation
- 📤 S3 file upload
- 📧 Email with Resend

## 📖 Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 📄 License

Private - All rights reserved.
