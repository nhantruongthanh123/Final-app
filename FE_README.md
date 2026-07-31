# FE Project README

## Overview
This repository contains the frontend of a photo-sharing web application built with React, TypeScript, and Vite. The UI is organized around three main user experiences:

- Visitor experience for browsing and authentication
- User experience for managing photos, albums, profiles, and social interactions
- Admin experience for moderation and content management

## Main Architecture
The frontend follows a modular structure centered around route-based layouts and feature folders.

### Core design approach
- App entry is initialized in the Vite + React setup
- Routing is handled by React Router with separate layouts for visitors, authenticated users, and admins
- Global state is managed with Zustand for authentication and theme-related state
- Server state is handled with TanStack Query for API-driven data fetching
- Form validation uses React Hook Form + Zod
- Styling is powered by Tailwind CSS with a shadcn-style component structure

### Request flow
- API calls are centralized through an Axios client
- The client attaches access tokens to requests
- It also handles automatic token refresh on 401 responses for smoother authentication flow

## Technology Stack
### Frontend core
- React 19
- TypeScript
- Vite
- React Router DOM

### State and data fetching
- Zustand
- TanStack React Query
- Axios

### UI and styling
- Tailwind CSS
- Lucide React
- Sonner (toast notifications)
- next-themes
- class-variance-authority / clsx / tailwind-merge

### Form handling and validation
- React Hook Form
- Zod
- @hookform/resolvers

## Project Structure
```text
frontend/
  src/
    App.tsx                # Main router and layout setup
    main.tsx               # App bootstrap and QueryClient setup
    components/            # Reusable UI and feature components
    contexts/              # Theme and shared context providers
    hooks/                 # Custom hooks
    layouts/               # Visitor, user, admin, and profile layouts
    pages/                 # Page-level views by feature
    services/              # API services and Axios client
    store/                 # Zustand stores
    schemas/               # Zod validation schemas
    types/                 # TypeScript types
    utils/                 # Helper utilities
```

## Main Features
- Authentication: login, register, forgot/reset password, email verification
- Photo management: upload, edit, delete, browse
- Album management: create, edit, view albums
- User profile: edit profile, follow/follower/following views
- Admin panel: manage users, photos, and albums

## Environment Configuration
The frontend expects a backend URL configured via:

```env
VITE_BACKEND_URL=your_backend_url
```

## Available Scripts
From the frontend folder:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Summary
This frontend is a modern, scalable React application with clear separation between routing, layouts, services, features, and shared UI. It is designed to support a full user-facing experience while keeping API logic and state handling organized and reusable.
