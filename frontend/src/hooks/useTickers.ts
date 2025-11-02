'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const REFRESH_INTERVAL = 5000; // 5 seconds

export function useTickers() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>(`${API_URL}/api/tickers`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up auto-refresh
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
