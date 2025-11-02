export interface TickerData {
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

export interface AlertData {
  symbol: string;
  percentChange: string;
}

export interface ApiResponse {
  topGainers: TickerData[];
  topLosers: TickerData[];
  alerts: AlertData[];
  totalSymbols: number;
  lastUpdate: string;
}

export type ViewMode = 'gainers' | 'losers';

export type SortField = 'symbol' | 'lastPrice' | 'priceChangePercent' | 'quoteVolume' | 'highPrice' | 'lowPrice';

export type SortOrder = 'asc' | 'desc';
