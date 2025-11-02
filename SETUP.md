# 🚀 Setup Guide

## Prerequisites

- Node.js 18+ and npm installed
- Internet connection to access Binance API

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables (Optional)

Backend (default port is 3001):
```bash
cd backend
cp .env.example .env
# Edit .env if you want to change the port
```

Frontend (default API URL is http://localhost:3001):
```bash
cd ../frontend
cp .env.example .env.local
# Edit .env.local if your backend runs on a different port
```

## Running the Application

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### Option 2: Quick Start Script

From the root directory, you can run both:

**Backend:**
```bash
cd backend && npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend && npm run dev
```

## Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. The dashboard will automatically start fetching data from Binance
3. Data updates every 5 seconds automatically

## Features to Try

1. **Toggle Views**: Click "Top 20 Gainers" or "Top 20 Losers" to switch between views
2. **Sort Data**: Click any column header to sort the table
3. **Enable Notifications**: Click "Enable" button to allow browser notifications for alerts
4. **Sound Alerts**: Toggle "Sound On" to enable audio alerts
5. **Monitor Alerts**: Watch for red blinking rows when a top gainer drops ≥3% in 1 hour

## API Endpoints

- `GET http://localhost:3001/api/tickers` - Get all ticker data with rankings and alerts
- `GET http://localhost:3001/api/health` - Health check endpoint

## Troubleshooting

### Backend won't start
- Check if port 3001 is available: `lsof -i :3001`
- Try changing the port in `backend/.env`

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:3001
- Check `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`

### No data showing
- Check your internet connection
- Verify Binance API is accessible: https://fapi.binance.com/fapi/v1/ticker/24hr
- Check browser console for errors

### Notifications not working
- Click "Enable" button in the dashboard
- Allow notifications when prompted by browser
- Note: Notifications require HTTPS in production (works on localhost in development)

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Development Notes

- Backend caches Binance API responses for 4 seconds to reduce API calls
- Frontend auto-refreshes every 5 seconds
- Price history is stored in-memory for 1 hour for alert detection
- Alerts trigger when top 20 gainers drop ≥3% within the last hour

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Axios for API calls
- In-memory caching

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- TypeScript

## Future Enhancements

See README.md for planned features like:
- Price sparklines
- Volume surge detection
- MongoDB integration
- WebSocket support
