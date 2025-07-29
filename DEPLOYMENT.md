# Deployment Guide

## Quick Start

### Development Mode

Run both frontend and backend servers:

```bash
./run-dev.sh
```

### Individual Server Startup

**Backend Only:**

```bash
cd backend
python app.py
```

**Frontend Only:**

```bash
cd frontend
npm run dev
```

## Production Deployment

### 1. Environment Configuration

**Frontend Production (.env.production):**

```bash
VITE_API_BASE_URL=https://your-domain.com/api
VITE_APP_ENV=production
```

**Backend Production (.env.production):**

```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-production-secret-key
API_BASE_URL=https://your-domain.com/api
CORS_ORIGINS=https://your-domain.com
```

### 2. Build Frontend

```bash
cd frontend
npm run build
```

### 3. Deploy Backend

```bash
cd backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Portal Access URLs

- **User Portal**: `http://localhost:5000/user-portal`
- **Admin Portal**: `http://localhost:5000/admin-portal`

## Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## API Integration

The project is configured to work with Flask API endpoints:

- `/user-portal` - Serves the LD SaaS platform
- `/admin-portal` - Serves the admin dashboard

All API calls go through the `/api` prefix and are configured via environment variables for easy production deployment.
