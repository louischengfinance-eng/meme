import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Binance Futures API endpoint
const BINANCE_API_URL = 'https://fapi.binance.com/fapi/v1/ticker/24hr';

// Cache configuration
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
  weightedAvgPrice: string;
  lastQty: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
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

// Fetch data from Binance API
async function fetchBinanceData(): Promise<TickerData[]> {
  try {
    const response = await axios.get<TickerData[]>(BINANCE_API_URL, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Binance data:', error);
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
    const data = await fetchBinanceData();

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
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Binance API proxy ready`);
});
