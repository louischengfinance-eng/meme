# 🏗️ Architecture Overview

## System Design

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Browser   │ ◄─────► │   Next.js    │ ◄─────► │  Express API    │
│  (Frontend) │         │   Frontend   │         │   (Backend)     │
└─────────────┘         └──────────────┘         └─────────────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  Binance API    │
                                                  │  (External)     │
                                                  └─────────────────┘
```

## Backend Architecture

### Components

1. **Express Server** (`backend/src/index.ts`)
   - REST API endpoints
   - CORS enabled for frontend communication
   - In-memory data caching

2. **Binance API Proxy**
   - Fetches from `https://fapi.binance.com/fapi/v1/ticker/24hr`
   - 4-second cache to reduce API calls
   - Filters USDT perpetual contracts only

3. **Price History Tracker**
   - Maintains 1-hour rolling window of prices
   - Map structure: `symbol -> PriceHistory[]`
   - Automatic cleanup of old data

4. **Alert Detection System**
   - Monitors top 20 gainers
   - Detects ≥3% drops within 1 hour
   - Compares current price vs 1-hour-ago price

### Data Flow

1. Client requests `/api/tickers`
2. Check if cached data is valid (<4 seconds old)
3. If cache expired:
   - Fetch fresh data from Binance
   - Update price history
   - Update cache
4. Process data:
   - Filter USDT contracts
   - Sort by gain/loss
   - Get top 20 each
   - Detect alerts
5. Return processed response

### API Response Structure

```typescript
{
  topGainers: TickerData[],      // Top 20 gainers
  topLosers: TickerData[],       // Top 20 losers
  alerts: AlertData[],           // Active alerts
  totalSymbols: number,          // Total USDT pairs
  lastUpdate: string             // ISO timestamp
}
```

## Frontend Architecture

### Components

1. **Page Component** (`frontend/src/app/page.tsx`)
   - Main dashboard container
   - State management for view mode
   - Notification handling
   - Auto-refresh coordination

2. **TickerTable** (`frontend/src/components/TickerTable.tsx`)
   - Sortable data table
   - Alert highlighting
   - Number formatting
   - Column-based sorting

3. **AlertPanel** (`frontend/src/components/AlertPanel.tsx`)
   - Alert visualization
   - Sound effects
   - Alert tracking

### Custom Hooks

1. **useTickers** (`frontend/src/hooks/useTickers.ts`)
   - Data fetching with axios
   - Auto-refresh every 5 seconds
   - Error handling
   - Loading states

2. **useNotifications** (`frontend/src/hooks/useNotifications.ts`)
   - Browser Notification API wrapper
   - Permission management
   - Notification display

### State Management

```
User Interactions
      │
      ├─► View Mode Toggle (gainers/losers)
      ├─► Sort Column/Order
      ├─► Enable Notifications
      └─► Enable Sound

Auto Updates (5s interval)
      │
      └─► Fetch API Data
           │
           ├─► Update Table
           ├─► Check for New Alerts
           └─► Trigger Notifications
```

## Alert Detection Algorithm

```typescript
for each symbol in top20Gainers:
  1. Get price history for symbol
  2. Find price from ~1 hour ago (with 5min buffer)
  3. Calculate: percentChange = ((current - old) / old) * 100
  4. if percentChange <= -3%:
       trigger alert for symbol
```

### Why 1-hour window?
- Catches rapid drops, not gradual declines
- Long enough to be significant
- Short enough to be actionable

## Caching Strategy

### Backend Cache
- **Duration**: 4 seconds
- **Why**: Binance rate limits + reduce redundant calls
- **Storage**: In-memory object

### Price History Cache
- **Duration**: 1 hour rolling window
- **Why**: Alert detection needs historical comparison
- **Storage**: Map<symbol, PriceHistory[]>
- **Cleanup**: Automatic on each update

## Real-time Updates

### Current Implementation
- **Polling**: Every 5 seconds from frontend
- **Pros**: Simple, reliable, no connection management
- **Cons**: Not true real-time, higher bandwidth

### Future: WebSocket Implementation
```
Client ◄──WebSocket──► Backend ◄──Polling──► Binance
       (push updates)          (fetch data)
```

Benefits:
- True real-time updates
- Lower frontend resource usage
- Instant alert notifications

## Scalability Considerations

### Current Limitations
1. **In-memory storage**: Lost on restart
2. **Single instance**: No horizontal scaling
3. **No persistence**: No historical analysis

### Future Improvements

1. **Database Layer**
   ```
   MongoDB/PostgreSQL
   ├── Historical prices
   ├── Alert logs
   └── User preferences
   ```

2. **Redis Cache**
   - Shared cache across instances
   - Price history persistence
   - Pub/Sub for WebSocket

3. **Microservices**
   ```
   ├── Data Fetcher Service
   ├── Alert Detection Service
   ├── WebSocket Server
   └── API Gateway
   ```

## Performance Optimizations

### Current
1. ✅ API response caching (4s)
2. ✅ Client-side memo for sorting
3. ✅ Efficient Map for price history
4. ✅ Automatic old data cleanup

### Planned
1. ⏳ WebSocket for push updates
2. ⏳ Virtual scrolling for large tables
3. ⏳ Server-side sorting/filtering
4. ⏳ CDN for static assets

## Security

### Current
1. ✅ CORS enabled (frontend only)
2. ✅ No API keys exposed (public Binance endpoint)
3. ✅ TypeScript for type safety

### Production Checklist
- [ ] Rate limiting
- [ ] Request validation
- [ ] HTTPS enforcement
- [ ] Environment variables
- [ ] Error logging/monitoring
- [ ] Input sanitization

## Testing Strategy

### Unit Tests
```
Backend:
├── Alert detection logic
├── Data processing
└── Cache management

Frontend:
├── Sorting logic
├── Number formatting
└── Alert detection
```

### Integration Tests
```
├── API endpoint responses
├── Real-time update flow
└── Notification triggers
```

### E2E Tests
```
├── User toggles view mode
├── User enables notifications
├── Alert appears and triggers notification
└── Table sorting works correctly
```

## Deployment

### Development
```
Backend:  localhost:3001
Frontend: localhost:3000
```

### Production Options

**Option 1: Separate Deployment**
```
Backend:  api.example.com (Express on VPS/EC2)
Frontend: example.com (Vercel/Netlify)
```

**Option 2: Unified Deployment**
```
example.com
├── /api/* → Express backend
└── /*     → Next.js frontend
```

**Recommended**: Option 2 with Next.js API routes or reverse proxy

## Monitoring

### Key Metrics
1. API response times
2. Binance API errors
3. Alert frequency
4. Active users
5. Cache hit rate

### Recommended Tools
- **Logging**: Winston, Pino
- **Monitoring**: Prometheus + Grafana
- **Errors**: Sentry
- **Analytics**: Google Analytics, Plausible
