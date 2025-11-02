# 🚀 Crypto Monitoring Dashboard

A real-time cryptocurrency monitoring system that tracks all Binance USDT perpetual contracts with alerts for rapid price movements.

## 📊 Features

- **Real-time Data**: Auto-updates every 5 seconds from Binance Futures API
- **Top 20 Rankings**: Toggle between top gainers and top losers
- **Smart Alerts**: Detects ≥3% drops within 1 hour for top gainers
- **Visual Notifications**: Red blinking alerts with optional sound/browser notifications
- **Sortable Table**: Click column headers to sort data
- **Modern UI**: Hyperliquid/CoinGlass-inspired dashboard design

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- In-memory caching
- Binance Futures API proxy

### Frontend
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Real-time updates

## 🚦 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation and setup instructions.

### Quick Installation

From the root directory:

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

### Run Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Frontend runs on `http://localhost:3000`

Then open `http://localhost:3000` in your browser.

## 📡 API Endpoints

- `GET /api/tickers` - Get all perpetual contract data with rankings
- `GET /api/health` - Health check

## 🔔 Alert System

The system monitors the top 20 gainers and triggers alerts when:
- Price drops ≥3% within the last hour
- Visual: Red blinking row in table
- Audio: Optional sound notification
- Browser: Web Notification API (requires permission)

## 📈 Data Points

- Symbol (Trading Pair)
- Current Price
- 24h Change %
- 24h High / Low
- Volume (USDT)
- Open / Close Price

## 🔮 Future Enhancements

- [ ] 1-hour price sparklines
- [ ] Volume surge detection
- [ ] 1-minute volatility calculation
- [ ] Event logging to MongoDB
- [ ] WebSocket for push updates
- [ ] Custom alert thresholds
