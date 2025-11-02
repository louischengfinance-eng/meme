'use client';

import { AlertData } from '@/types';
import { useEffect, useRef } from 'react';

interface AlertPanelProps {
  alerts: AlertData[];
  onAlertSound?: boolean;
}

export default function AlertPanel({ alerts, onAlertSound = false }: AlertPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!onAlertSound || alerts.length === 0) return;

    const currentAlerts = new Set(alerts.map(a => a.symbol));
    const newAlerts = alerts.filter(a => !previousAlertsRef.current.has(a.symbol));

    if (newAlerts.length > 0) {
      // Play alert sound for new alerts
      audioRef.current?.play().catch(err => {
        console.warn('Could not play alert sound:', err);
      });
    }

    previousAlertsRef.current = currentAlerts;
  }, [alerts, onAlertSound]);

  if (alerts.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          Active Alerts
        </h2>
        <p className="text-gray-500 text-center py-8">
          No rapid price drops detected
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-red-400 animate-pulse">⚠</span>
          Active Alerts ({alerts.length})
        </h2>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.symbol}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center justify-between animate-pulse"
            >
              <div>
                <span className="font-mono font-semibold text-white text-lg">
                  {alert.symbol.replace('USDT', '')}
                </span>
                <span className="text-gray-500 text-sm ml-2">USDT</span>
              </div>
              <div className="text-right">
                <div className="text-red-400 font-semibold text-lg">
                  {alert.percentChange}%
                </div>
                <div className="text-gray-500 text-xs">1h drop</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Showing coins that dropped ≥3% in the last hour
        </div>
      </div>

      {/* Hidden audio element for alert sound */}
      {onAlertSound && (
        <audio
          ref={audioRef}
          preload="auto"
        >
          {/* Using a simple data URL for a beep sound */}
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ8PVqzn77BZGwxDmN7xwW8iBS6Cx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThAOUqvm77NdHw1Endzxwm8jBS6Dx/XafTYIH3LC7+WZThANU="
            type="audio/wav"
          />
        </audio>
      )}
    </>
  );
}
