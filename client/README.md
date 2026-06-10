# Dribbling ERP - Frontend

Frontend application for the Dribbling ERP system - a production-ready uranium drilling company management system.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app router pages
- `shared/config/` - Configuration files (API client, theme, i18n)
- `shared/hooks/` - Custom React hooks (TanStack Query hooks)
- `shared/ui/` - Reusable UI components
- `shared/lib/` - Utility functions

## Features

- **Dashboard**: KPI metrics and activity feed
- **Workers**: Manage drilling workers
- **Brigades**: Manage drilling teams
- **Machines**: Manage drilling equipment
- **Wells**: Track well drilling progress
- **Warehouse**: Inventory management
- **Purchases**: Procurement tracking

## Mobile-First Design

The application is designed with mobile-first principles:
- Responsive layout with desktop sidebar and mobile bottom navigation
- Touch-friendly interface with large tap targets
- Optimized for field use on tablets and phones

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
