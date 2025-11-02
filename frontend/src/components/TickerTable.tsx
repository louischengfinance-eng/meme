'use client';

import { useState, useMemo } from 'react';
import { TickerData, SortField, SortOrder, AlertData } from '@/types';
import clsx from 'clsx';

interface TickerTableProps {
  tickers: TickerData[];
  alerts: AlertData[];
}

export default function TickerTable({ tickers, alerts }: TickerTableProps) {
  const [sortField, setSortField] = useState<SortField>('priceChangePercent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const alertSymbols = useMemo(() => {
    return new Set(alerts.map(alert => alert.symbol));
  }, [alerts]);

  const sortedTickers = useMemo(() => {
    const sorted = [...tickers].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'lastPrice':
          aValue = parseFloat(a.lastPrice);
          bValue = parseFloat(b.lastPrice);
          break;
        case 'priceChangePercent':
          aValue = parseFloat(a.priceChangePercent);
          bValue = parseFloat(b.priceChangePercent);
          break;
        case 'quoteVolume':
          aValue = parseFloat(a.quoteVolume);
          bValue = parseFloat(b.quoteVolume);
          break;
        case 'highPrice':
          aValue = parseFloat(a.highPrice);
          bValue = parseFloat(b.highPrice);
          break;
        case 'lowPrice':
          aValue = parseFloat(a.lowPrice);
          bValue = parseFloat(b.lowPrice);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortOrder === 'asc' ? aValue - (bValue as number) : (bValue as number) - aValue;
    });

    return sorted;
  }, [tickers, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatNumber = (num: string, decimals: number = 2): string => {
    const value = parseFloat(num);
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(decimals);
  };

  const formatPrice = (price: string): string => {
    const value = parseFloat(price);
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    return value.toFixed(2);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-600">⇅</span>;
    }
    return <span className="text-blue-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 border-b border-gray-800">
          <tr>
            <th className="text-left p-3 font-semibold text-gray-300">Rank</th>
            <th
              className="text-left p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('symbol')}
            >
              <div className="flex items-center gap-2">
                Symbol <SortIcon field="symbol" />
              </div>
            </th>
            <th
              className="text-right p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('lastPrice')}
            >
              <div className="flex items-center justify-end gap-2">
                Price <SortIcon field="lastPrice" />
              </div>
            </th>
            <th
              className="text-right p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('priceChangePercent')}
            >
              <div className="flex items-center justify-end gap-2">
                24h % <SortIcon field="priceChangePercent" />
              </div>
            </th>
            <th
              className="text-right p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('highPrice')}
            >
              <div className="flex items-center justify-end gap-2">
                24h High <SortIcon field="highPrice" />
              </div>
            </th>
            <th
              className="text-right p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('lowPrice')}
            >
              <div className="flex items-center justify-end gap-2">
                24h Low <SortIcon field="lowPrice" />
              </div>
            </th>
            <th
              className="text-right p-3 font-semibold text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => handleSort('quoteVolume')}
            >
              <div className="flex items-center justify-end gap-2">
                Volume (USDT) <SortIcon field="quoteVolume" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTickers.map((ticker, index) => {
            const isAlert = alertSymbols.has(ticker.symbol);
            const changePercent = parseFloat(ticker.priceChangePercent);
            const isPositive = changePercent >= 0;

            return (
              <tr
                key={ticker.symbol}
                className={clsx(
                  'border-b border-gray-800 hover:bg-gray-900/50 transition-colors',
                  {
                    'animate-blink-red': isAlert,
                  }
                )}
              >
                <td className="p-3 text-gray-400">#{index + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-white">
                      {ticker.symbol.replace('USDT', '')}
                    </span>
                    <span className="text-gray-500 text-xs">USDT</span>
                    {isAlert && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                        ⚠ Alert
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right font-mono text-white">
                  ${formatPrice(ticker.lastPrice)}
                </td>
                <td className="p-3 text-right font-mono font-semibold">
                  <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                    {isPositive ? '+' : ''}
                    {changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="p-3 text-right font-mono text-gray-300">
                  ${formatPrice(ticker.highPrice)}
                </td>
                <td className="p-3 text-right font-mono text-gray-300">
                  ${formatPrice(ticker.lowPrice)}
                </td>
                <td className="p-3 text-right font-mono text-gray-400">
                  ${formatNumber(ticker.quoteVolume, 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
