# 🚀 Setup Guide

## Prerequisites

- Node.js 18+ and npm installed
- Internet connection to access Bybit API
- Bybit API credentials (API Key and Secret)

## Get Bybit API Credentials

1. Go to [Bybit API Management](https://www.bybit.com/app/user/api-management)
2. Create a new API key
3. Set permissions: **Read-Only** is sufficient (no trading permissions needed)
4. Save your API Key and API Secret securely
5. **Important**: Enable IP restrictions for better security

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

### 3. Configure Environment Variables (REQUIRED)

**Backend Configuration:**

The backend `.env` file is already configured with your API credentials. If you need to update them:

```bash
cd backend
# Edit .env file
```

Your `.env` should contain:
```env
PORT=3001

# Bybit API Credentials
BYBIT_API_KEY=your_api_key_here
BYBIT_API_SECRET=your_api_secret_here
```

**⚠️ Security Note**: The `.env` file is in `.gitignore` and will NOT be committed to Git.

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
- Verify your `.env` file exists in the `backend/` directory

### API Authentication Error
- Verify your Bybit API credentials are correct in `backend/.env`
- Check that your API key has the correct permissions (Read-Only is sufficient)
- Ensure your API key is not expired
- Check if IP restrictions are properly configured on Bybit

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:3001
- Check `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`
- Look for CORS errors in browser console

### No data showing
- Check your internet connection
- Verify Bybit API is accessible: https://api.bybit.com/v5/market/tickers?category=linear
- Check browser console for errors
- Look at backend terminal for error messages
- Run `curl http://localhost:3001/api/health` to check backend status

### Rate Limiting
- If you see "rate limit" errors, your API key provides higher limits
- The system caches data for 4 seconds to reduce API calls
- Authenticated requests have higher rate limits than public requests

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

- Backend uses authenticated Bybit V5 API for higher rate limits
- Bybit API responses are cached for 4 seconds to reduce API calls
- Frontend auto-refreshes every 5 seconds
- Price history is stored in-memory for 1 hour for alert detection
- Alerts trigger when top 20 gainers drop ≥3% within the last hour
- HMAC SHA256 signature authentication for secure API access

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Axios for API calls
- In-memory caching
- Crypto module for HMAC authentication

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- TypeScript

## API Information

**Bybit V5 API Documentation:**
- Main docs: https://bybit-exchange.github.io/docs/v5/intro
- Market data: https://bybit-exchange.github.io/docs/v5/market/tickers
- Authentication: https://bybit-exchange.github.io/docs/v5/guide#authentication

## Future Enhancements

See README.md for planned features like:
- Price sparklines
- Volume surge detection
- MongoDB integration
- WebSocket support
