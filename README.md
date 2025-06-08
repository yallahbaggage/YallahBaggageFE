# Frontend Application

This directory contains the Vue frontend application for the Service Management Platform.

## Directory Structure

```
FE/
├── src/
│   ├── components/     # Reusable components
│   ├── models/         # TypeScript interfaces
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required environment variables:
```
VITE_API_URL=http://localhost:5000/api/v1
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run test` - Run tests

## Features

- User authentication
- Role-based access control
- Service management
- Worker management
- Order processing
- Advertisement management
- Multi-language support
- Responsive design
