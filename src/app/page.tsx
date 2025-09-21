"use client";

import { useState, useEffect, useCallback } from "react";
import AppWrapper from "@/components/AppWrapper";

// Disable static generation for this page
export const dynamic = "force-dynamic";

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  cmcRank: number;
  marketCap: number;
  price: number;
  change24h: number;
  volume24h: number;
}

export default function Home() {
  const [allCryptoData, setAllCryptoData] = useState<CryptoData[]>([]);
  const [speed, setSpeed] = useState(3000); // 3 seconds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = useCallback(async () => {
    try {
      setError(null);
      console.log("Fetching crypto data at:", new Date().toISOString());
      const response = await fetch("/api/crypto");

      if (!response.ok) {
        throw new Error("Failed to fetch cryptocurrency data");
      }

      const data = await response.json();
      console.log(
        "Fetched crypto data:",
        data.length,
        "items at:",
        new Date().toISOString()
      );
      setAllCryptoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchCryptoData();
      setLoading(false);
    };
    initialFetch();
  }, [fetchCryptoData]);

  // Set up automatic data fetching for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoData();
    }, speed);

    return () => clearInterval(interval);
  }, [fetchCryptoData, speed]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <AppWrapper
      allCryptoData={allCryptoData}
      loading={loading}
      error={error}
      fetchCryptoData={fetchCryptoData}
      speed={speed}
      handleSpeedChange={handleSpeedChange}
    />
  );
}
