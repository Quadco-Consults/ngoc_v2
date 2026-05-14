# NGOS v2 - Nigerian Gas Operations System

A production-grade web application for managing Nigeria's gas sector operations, built with the NUIMS360v2 stack and design patterns.

## Overview

NGOS v2 is a comprehensive gas operations management system that provides:
- Real-time monitoring of gas production and distribution
- Asset management for gas fields, pipelines, plants, and terminals
- Commercial operations (nominations, allocations, balancing)
- Production tracking and flare monitoring
- Maintenance scheduling and deferment management
- Executive dashboards with KPIs and analytics

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### State Management
- **Redux Toolkit** - Global state management
- **Redux Persist** - State persistence
- **React Query** - Server state and caching

### Routing & Navigation
- **React Router v7** - Client-side routing

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **DaisyUI** - Component library
- **Material-UI** - Additional components
- **Lucide React** - Icon library

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Data Visualization
- **Recharts** - Charts and graphs
- **Mapbox GL** - Pipeline network maps
- **Turf.js** - Geospatial analysis

### HTTP & API
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## Project Structure

```
ngos_v2/
├── src/
│   ├── modules/              # Feature modules
│   │   └── dashboard/
│   │       └── ExecutiveDashboard.tsx
│   ├── components/           # Shared components
│   │   ├── layout/          # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   └── shared/          # Reusable components
│   │       └── KPICard.tsx
│   ├── routes/              # Route definitions
│   │   └── index.tsx
│   ├── store/               # Redux store
│   │   ├── index.ts
│   │   └── authSlice.ts
│   ├── hooks/               # Custom hooks
│   │   └── useRedux.ts
│   ├── lib/                 # Utilities and configs
│   │   ├── utils.ts
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   ├── gas-assets.ts
│   │   └── operations.ts
│   ├── constants/           # App constants
│   └── assets/              # Static assets
├── public/                  # Public assets
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Features

### Gas Assets Management
- **Gas Fields** - Field management with reserves and production tracking
- **Gas Wells** - Well monitoring and production data
- **Gas Pipelines** - Pipeline network with flow and pressure monitoring
- **Gas Plants** - Processing plants with throughput and efficiency metrics
- **LNG Terminals** - LNG export terminals with train management
- **Compression Stations** - Compressor monitoring and fuel gas consumption
- **Power Stations** - Gas-to-power facilities and consumption tracking

### Production Management
- **Gas Production** - Daily production reporting (MMSCF/D)
- **Field Production** - Production by field and operator
- **Plant Production** - Processing plant output and NGL/LPG production
- **Flare Monitoring** - Gas flaring tracking with penalties

### Commercial Operations
- **Gas Nominations** - Daily/monthly gas nomination workflow
- **Gas Allocations** - Capacity allocation and priority management
- **Gas Balancing** - Imbalance tracking and reconciliation
- **Gas Contracts** - GSA/GPA/GTA contract management

### Operations
- **Maintenance Schedule** - Planned and preventive maintenance
- **Deferments** - Production deferment tracking
- **Incidents** - Safety and operational incident reporting

### Dashboards
- **Executive Dashboard** - High-level KPIs and national gas balance
- **Operations Dashboard** - Daily operations overview
- **Network Dashboard** - Pipeline network status
- **Analytics Dashboard** - Advanced analytics and forecasting

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd ngos_v2
```

2. Install dependencies (already done):
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_BASE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Branding

### Colors
- **Primary**: #00AD51 (NUIMS Green)
- **Secondary**: #00246B (NUIMS Navy)
- **Accent**: #0D5EBA (NUIMS Blue)

### Typography
- **Sans-serif**: System UI fonts
- **Monospace**: UI Monospace

## Key Technologies & Patterns

### State Management
- Redux Toolkit for global state (auth, user preferences)
- React Query for server state (API data, caching)
- Redux Persist for local storage persistence

### Routing
- File-based route organization
- Lazy loading for code splitting
- Protected routes with authentication guards

### API Integration
- Axios client with interceptors
- Automatic token injection
- 401 handling and auto-logout

### Forms
- React Hook Form for performance
- Zod schemas for validation
- Type-safe form data

### Styling
- Tailwind utility classes
- Custom component classes (`.kpi-card`, `.sidebar-link`, etc.)
- Responsive design with mobile support

## Development Guidelines

### Adding New Modules

1. Create module folder in `src/modules/`:
```
src/modules/your-module/
├── index.tsx
├── components/
├── hooks/
├── types.ts
└── schema.ts
```

2. Add route in `src/routes/index.tsx`

3. Add navigation item in `src/components/layout/Sidebar.tsx`

### TypeScript Types

All types are defined in `src/types/`:
- `gas-assets.ts` - Asset-related types
- `operations.ts` - Operations-related types

### API Calls

Use the configured Axios client:
```typescript
import apiClient from '@/lib/api';

const fetchData = async () => {
  const response = await apiClient.get('/endpoint');
  return response.data;
};
```

### Styling

Use Tailwind utility classes and custom component classes:
```tsx
<div className="kpi-card">
  <button className="btn-primary">Click Me</button>
</div>
```

## Deployment

### Docker
```bash
docker build -t ngos-v2 .
docker run -p 8000:80 ngos-v2
```

### Environment Variables
Set these in your deployment platform:
- `VITE_BASE_API_URL` - Backend API URL
- `VITE_MAPBOX_TOKEN` - Mapbox access token

## License

Proprietary - Nigerian Gas Operating System

## Support

For support and questions, contact the development team.
