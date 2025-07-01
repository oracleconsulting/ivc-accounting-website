# IVC System Linking Guide

## Overview

The IVC ecosystem consists of two main systems:
1. **IVC Website** - Public-facing marketing site (runs on port 3000)
2. **IVC Outreach System** - Admin dashboard for client management (runs on port 3001)

## Running Both Systems

### Option 1: Using Docker (Recommended)

```bash
# Terminal 1 - Run IVC Website
cd ivc-website
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Run IVC Outreach System
cd ivc-outreach-system
docker-compose up
# Frontend runs on http://localhost:3001
# Backend API runs on http://localhost:8000
```

### Option 2: Manual Setup

```bash
# Terminal 1 - IVC Website
cd ivc-website
npm install
npm run dev

# Terminal 2 - IVC Outreach Backend
cd ivc-outreach-system/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 3 - IVC Outreach Frontend
cd ivc-outreach-system/frontend
npm install
npm run dev -- --port 3001
```

## System Links

### From IVC Website → Outreach System

The navigation includes a "CLIENT LOGIN" button that links to the outreach system:
- Development: `http://localhost:3001/admin`
- Production: `https://outreach.ivcaccounting.co.uk/admin`

### From Outreach System → IVC Website

Add a "Back to Main Site" link in the outreach header:
- Development: `http://localhost:3000`
- Production: `https://www.ivcaccounting.co.uk`

## Environment Configuration

### IVC Website (.env.local)
```env
NEXT_PUBLIC_OUTREACH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### IVC Outreach Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_MAIN_SITE_URL=http://localhost:3000
```

### IVC Outreach Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ivc_outreach
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3001
MAIN_SITE_URL=http://localhost:3000
```

## Production Deployment

### Domain Structure
- Main Website: `www.ivcaccounting.co.uk`
- Outreach System: `outreach.ivcaccounting.co.uk` or `portal.ivcaccounting.co.uk`
- API Backend: `api.ivcaccounting.co.uk`

### Railway Deployment
Both systems can be deployed on Railway with custom domains:

1. Deploy IVC Website to Railway
2. Deploy IVC Outreach (frontend & backend) to Railway
3. Configure custom domains in Railway dashboard
4. Update environment variables with production URLs

## Features Integration

### Shared Features
1. **Client Counter**: Both systems can share the client count via API
2. **Authentication**: Single sign-on can be implemented using shared JWT tokens
3. **Branding**: Both use the IVC Oracle style guide for consistency

### API Integration
The IVC website can pull data from the outreach API:
- Current client count for the hero section
- Recent testimonials or success stories
- Dynamic pricing based on availability

## Testing the Integration

1. Start both systems
2. Navigate to http://localhost:3000 (IVC Website)
3. Click "CLIENT LOGIN" → Should open http://localhost:3001/admin
4. In the outreach system, click "Back to Main Site" → Should return to http://localhost:3000

## Troubleshooting

### Port Conflicts
If port 3000 is already in use:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports
npm run dev -- --port 3002
```

### CORS Issues
Ensure both systems allow cross-origin requests:
- Add frontend URLs to backend CORS configuration
- Use proxy configuration in development

### Database Connection
Ensure PostgreSQL and Redis are running:
```bash
# Check PostgreSQL
pg_isready

# Check Redis
redis-cli ping
``` 