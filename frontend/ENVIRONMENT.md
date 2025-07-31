# Environment Configuration

This project uses environment variables to manage different deployment configurations.

## Environment Files

- `.env` - Default environment (development)
- `.env.development` - Development environment
- `.env.production` - Production environment

## Available Environment Variables

| Variable            | Description          | Development                 | Production                                  |
| ------------------- | -------------------- | --------------------------- | ------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` | `https://test-l-d-backend.onrender.com/api` |
| `VITE_ENV`          | Environment name     | `development`               | `production`                                |

## Available Scripts

### Development

```bash
npm run dev          # Start development server (uses .env.development)
npm run dev:prod     # Start development server with production config
```

### Build

```bash
npm run build        # Build for production (uses .env.production)
npm run build:dev    # Build for development (uses .env.development)
npm run build:prod   # Build for production (uses .env.production)
```

### Preview

```bash
npm run preview      # Preview production build
npm run preview:prod # Preview production build with production config
```

## How to Switch Environments

### For Development (Local Backend)

```bash
npm run dev
```

### For Production (Deployed Backend)

```bash
npm run dev:prod
```

### For Building Production

```bash
npm run build:prod
```

## Environment Detection in Code

The API configuration automatically detects the environment:

```javascript
// In src/config/api.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
};

export const ENV = import.meta.env.VITE_ENV || "development";
export const IS_PRODUCTION = ENV === "production";
export const IS_DEVELOPMENT = ENV === "development";
```

## Console Logging

The application logs the current environment and API URL to help with debugging:

```
🚀 API Base URL: https://test-l-d-backend.onrender.com/api
🌍 Environment: production
```
