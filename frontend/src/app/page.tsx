'use client';

import { useState, useEffect } from 'react';
import { useTickers } from '@/hooks/useTickers';
import { useNotifications } from '@/hooks/useNotifications';
import TickerTable from '@/components/TickerTable';
import AlertPanel from '@/components/AlertPanel';
import { ViewMode } from '@/types';

export default function Home() {
  const { data, loading, error } = useTickers();
  const { permission, requestPermission, showNotification, isSupported } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>('gainers');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastAlertCount, setLastAlertCount] = useState(0);

  // Show browser notification when new alerts appear
  useEffect(() => {
    if (!data || !data.alerts) return;

    const currentAlertCount = data.alerts.length;

    if (currentAlertCount > lastAlertCount && permission === 'granted') {
      const newAlerts = data.alerts.slice(lastAlertCount);
      newAlerts.forEach(alert => {
        showNotification('🚨 Crypto Alert!', {
          body: `${alert.symbol} dropped ${alert.percentChange}% in the last hour`,
          tag: alert.symbol,
        });
      });
    }

    setLastAlertCount(currentAlertCount);
  }, [data?.alerts, lastAlertCount, permission, showNotification]);

  const handleEnableNotifications = async () => {
    if (permission === 'default') {
      await requestPermission();
    }
  };

  const currentTickers = viewMode === 'gainers' ? data?.topGainers : data?.topLosers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Crypto Monitoring Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Real-time Binance USDT Perpetual Contracts
              </p>
            </div>
            <div className="flex items-center gap-4">
              {data && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Last Update</div>
                  <div className="text-sm text-gray-300 font-mono">
                    {new Date(data.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              )}
              {loading && (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Total Symbols</div>
            <div className="text-3xl font-bold text-white">
              {data?.totalSymbols || '-'}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Active Alerts</div>
            <div className="text-3xl font-bold text-red-400">
              {data?.alerts.length || 0}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Notifications</div>
            <div className="flex gap-2">
              {isSupported ? (
                <>
                  {permission !== 'granted' && (
                    <button
                      onClick={handleEnableNotifications}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Enable
                    </button>
                  )}
                  {permission === 'granted' && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <span className="text-lg">✓</span> Enabled
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-sm">Not Supported</div>
              )}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  soundEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        {data && data.alerts.length > 0 && (
          <div className="mb-6">
            <AlertPanel alerts={data.alerts} onAlertSound={soundEnabled} />
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('gainers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                viewMode === 'gainers'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📈 Top 20 Gainers
            </button>
            <button
              onClick={() => setViewMode('losers')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                viewMode === 'losers'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📉 Top 20 Losers
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Auto-updates every 5 seconds
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
            <div className="text-red-400 font-semibold mb-2">Error Loading Data</div>
            <div className="text-gray-400 text-sm">{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-gray-400">Loading data from Binance...</div>
            </div>
          </div>
        )}

        {/* Table */}
        {data && currentTickers && (
          <TickerTable tickers={currentTickers} alerts={data.alerts} />
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Data updates automatically every 5 seconds • Alerts trigger on ≥3% drops within 1 hour
          </p>
          <p className="mt-2">
            Powered by Binance Futures API • {data?.topGainers.length || 0} symbols tracked
          </p>
        </div>
      </main>
    </div>
  );
}
