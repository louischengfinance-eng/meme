import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Bybit API configuration
const BYBIT_API_URL = 'https://api.bybit.com';
const BYBIT_API_KEY = process.env.BYBIT_API_KEY || '';
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET || '';

// Bybit API response interfaces
interface BybitTicker {
  symbol: string;
  lastPrice: string;
  price24hPcnt: string;
  highPrice24h: string;
  lowPrice24h: string;
  volume24h: string;
  turnover24h: string;
  openPrice24h?: string;
  prevPrice24h?: string;
}

interface BybitResponse {
  retCode: number;
  retMsg: string;
  result: {
    category: string;
    list: BybitTicker[];
  };
  time: number;
}

// Normalized ticker data interface
interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  closePrice: string;
  priceChange: string;
}

interface CachedData {
  data: TickerData[];
  timestamp: number;
}

interface PriceHistory {
  price: number;
  timestamp: number;
}

// Store historical prices for alert detection (keep 1 hour of data)
const priceHistory = new Map<string, PriceHistory[]>();
const CACHE_DURATION = 4000; // 4 seconds (fetch every 5 seconds, but allow 4s cache)
const HISTORY_DURATION = 3600000; // 1 hour in milliseconds

let cachedData: CachedData | null = null;

// Generate Bybit API signature
// For GET requests: timestamp + api_key + recv_window + queryString
function generateSignature(timestamp: string, recvWindow: string, params: string): string {
  const message = timestamp + BYBIT_API_KEY + recvWindow + params;
  return crypto
    .createHmac('sha256', BYBIT_API_SECRET)
    .update(message)
    .digest('hex');
}

// Clean up old price history data
function cleanupOldHistory() {
  const now = Date.now();
  const cutoff = now - HISTORY_DURATION;

  priceHistory.forEach((history, symbol) => {
    const filtered = history.filter(entry => entry.timestamp > cutoff);
    if (filtered.length > 0) {
      priceHistory.set(symbol, filtered);
    } else {
      priceHistory.delete(symbol);
    }
  });
}

// Update price history
function updatePriceHistory(tickers: TickerData[]) {
  const now = Date.now();

  tickers.forEach(ticker => {
    if (!ticker.symbol.endsWith('USDT')) return;

    const price = parseFloat(ticker.lastPrice);
    const history = priceHistory.get(ticker.symbol) || [];

    // Add new price point
    history.push({ price, timestamp: now });

    // Keep only last hour of data
    const cutoff = now - HISTORY_DURATION;
    const filtered = history.filter(entry => entry.timestamp > cutoff);

    priceHistory.set(ticker.symbol, filtered);
  });

  // Periodic cleanup
  cleanupOldHistory();
}

// Check for rapid price drops
function detectAlerts(tickers: TickerData[], topGainers: TickerData[]): Map<string, number> {
  const alerts = new Map<string, number>();
  const now = Date.now();
  const oneHourAgo = now - HISTORY_DURATION;

  topGainers.forEach(ticker => {
    const history = priceHistory.get(ticker.symbol);
    if (!history || history.length < 2) return;

    // Find price from ~1 hour ago
    const oldPrices = history.filter(entry => entry.timestamp <= oneHourAgo + 300000); // 5 min buffer
    if (oldPrices.length === 0) return;

    const oldPrice = oldPrices[oldPrices.length - 1].price;
    const currentPrice = parseFloat(ticker.lastPrice);

    // Calculate percentage change
    const percentChange = ((currentPrice - oldPrice) / oldPrice) * 100;

    // Alert if dropped 3% or more
    if (percentChange <= -3) {
      alerts.set(ticker.symbol, percentChange);
    }
  });

  return alerts;
}

// Fetch data from Bybit API
async function fetchBybitData(): Promise<TickerData[]> {
  try {
    const timestamp = Date.now().toString();
    const endpoint = '/v5/market/tickers';
    const params = 'category=linear';

    // For public endpoints, authentication is optional but can provide higher rate limits
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Add authentication if API key is provided
    if (BYBIT_API_KEY && BYBIT_API_SECRET) {
      const recvWindow = '5000';
      const signature = generateSignature(timestamp, recvWindow, params);
      headers['X-BAPI-API-KEY'] = BYBIT_API_KEY;
      headers['X-BAPI-TIMESTAMP'] = timestamp;
      headers['X-BAPI-SIGN'] = signature;
      headers['X-BAPI-RECV-WINDOW'] = recvWindow;
    }

    const response = await axios.get<BybitResponse>(
      `${BYBIT_API_URL}${endpoint}?${params}`,
      {
        headers,
        timeout: 10000,
      }
    );

    if (response.data.retCode !== 0) {
      throw new Error(`Bybit API error: ${response.data.retMsg}`);
    }

    // Convert Bybit format to normalized format
    const normalizedData: TickerData[] = response.data.result.list.map(ticker => {
      // Calculate price change percent (Bybit gives it as decimal, e.g., 0.0234 = 2.34%)
      const priceChangePercent = (parseFloat(ticker.price24hPcnt) * 100).toString();

      // Calculate open price if not provided
      const openPrice = ticker.prevPrice24h || ticker.openPrice24h ||
        (parseFloat(ticker.lastPrice) / (1 + parseFloat(ticker.price24hPcnt))).toString();

      // Calculate price change
      const priceChange = (parseFloat(ticker.lastPrice) - parseFloat(openPrice)).toString();

      return {
        symbol: ticker.symbol,
        lastPrice: ticker.lastPrice,
        priceChangePercent: priceChangePercent,
        highPrice: ticker.highPrice24h,
        lowPrice: ticker.lowPrice24h,
        volume: ticker.volume24h,
        quoteVolume: ticker.turnover24h, // turnover is the quote volume in USDT
        openPrice: openPrice,
        closePrice: ticker.lastPrice, // lastPrice is the close price
        priceChange: priceChange,
      };
    });

    return normalizedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching Bybit data:', error.response?.data || error.message);
    } else {
      console.error('Error fetching Bybit data:', error);
    }
    throw error;
  }
}

// Main API endpoint
app.get('/api/tickers', async (req: Request, res: Response) => {
  try {
    const now = Date.now();

    // Check if cache is still valid
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      const processedData = processTickerData(cachedData.data);
      return res.json(processedData);
    }

    // Fetch fresh data
    const data = await fetchBybitData();

    // Update cache
    cachedData = {
      data,
      timestamp: now,
    };

    // Update price history for alert detection
    updatePriceHistory(data);

    // Process and return data
    const processedData = processTickerData(data);
    res.json(processedData);

  } catch (error) {
    console.error('Error in /api/tickers:', error);
    res.status(500).json({
      error: 'Failed to fetch ticker data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process ticker data
function processTickerData(data: TickerData[]) {
  // Filter for USDT perpetual contracts only
  const usdtTickers = data.filter(ticker => ticker.symbol.endsWith('USDT'));

  // Sort by price change percentage
  const sortedByGain = [...usdtTickers].sort(
    (a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
  );

  const sortedByLoss = [...usdtTickers].sort(
    (a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
  );

  // Get top 20 gainers and losers
  const topGainers = sortedByGain.slice(0, 20);
  const topLosers = sortedByLoss.slice(0, 20);

  // Detect alerts for top gainers
  const alerts = detectAlerts(usdtTickers, topGainers);

  return {
    topGainers,
    topLosers,
    alerts: Array.from(alerts.entries()).map(([symbol, change]) => ({
      symbol,
      percentChange: change.toFixed(2),
    })),
    totalSymbols: usdtTickers.length,
    lastUpdate: new Date().toISOString(),
  };
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cacheAge: cachedData ? Date.now() - cachedData.timestamp : null,
    historySize: priceHistory.size,
    apiProvider: 'Bybit',
    authenticated: !!(BYBIT_API_KEY && BYBIT_API_SECRET),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Bybit API proxy ready`);
  if (BYBIT_API_KEY && BYBIT_API_SECRET) {
    console.log(`🔑 Authenticated with Bybit API`);
  } else {
    console.log(`⚠️  Running without Bybit API authentication (public endpoints only)`);
  }
});
