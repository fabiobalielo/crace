"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

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

interface BarChartRaceProps {
  data: CryptoData[];
  totalCount?: number;
}

export default function BarChartRace({
  data,
  totalCount = 0,
}: BarChartRaceProps) {
  const [currentData, setCurrentData] = useState<CryptoData[]>([]);
  const previousDataRef = useRef<CryptoData[]>([]);

  // Sort data by CMC rank for display
  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.cmcRank - b.cmcRank),
    [data]
  );
  const maxMarketCap = useMemo(
    () => Math.max(...data.map((crypto) => crypto.marketCap)),
    [data]
  );

  // Remove the interval-based animation since we're now getting real-time data updates
  // The component will automatically re-render when new data comes in

  useEffect(() => {
    if (data.length > 0) {
      // Store the current data as previous before updating
      setCurrentData((prevData) => {
        previousDataRef.current = prevData;
        console.log("Updating chart data:", data.length, "items");
        if (data.length > 0) {
          console.log(
            "Top 3 cryptos:",
            data.slice(0, 3).map((c) => `${c.symbol}: $${c.price.toFixed(2)}`)
          );
        }
        return sortedData;
      });
    }
  }, [data, sortedData]);

  // Function to determine if price went up or down
  const getPriceChangeDirection = (crypto: CryptoData) => {
    const previousCrypto = previousDataRef.current.find(
      (p) => p.id === crypto.id
    );
    if (!previousCrypto) return "neutral";

    if (crypto.price > previousCrypto.price) return "up";
    if (crypto.price < previousCrypto.price) return "down";
    return "neutral";
  };

  // Function to determine if rank changed
  const getRankChange = (crypto: CryptoData) => {
    const previousCrypto = previousDataRef.current.find(
      (p) => p.id === crypto.id
    );
    if (!previousCrypto) return { direction: "neutral", change: 0 };

    const rankChange = previousCrypto.cmcRank - crypto.cmcRank;
    if (rankChange > 0) return { direction: "up", change: rankChange };
    if (rankChange < 0)
      return { direction: "down", change: Math.abs(rankChange) };
    return { direction: "neutral", change: 0 };
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(3)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(3)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(3)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(3)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPrice = (value: number) => {
    if (value >= 1000) return `$${value.toFixed(0)}`;
    if (value >= 1) return `$${value.toFixed(2)}`;
    return `$${value.toFixed(6)}`;
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Crace</h2>
        <div className="text-sm text-gray-400">
          Live • {currentData.length} of {totalCount} cryptocurrencies
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {currentData.map((crypto, index) => {
            const percentage = (crypto.marketCap / maxMarketCap) * 100;
            const isPositive = crypto.change24h >= 0;
            const priceDirection = getPriceChangeDirection(crypto);
            const rankChange = getRankChange(crypto);

            return (
              <motion.div
                key={crypto.id}
                className={`relative ${
                  rankChange.direction !== "neutral"
                    ? rankChange.direction === "up"
                      ? "ring-2 ring-green-500/50"
                      : "ring-2 ring-red-500/50"
                    : ""
                }`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: rankChange.direction !== "neutral" ? [1, 1.02, 1] : 1,
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  layout: { duration: 0.5, ease: "easeInOut" },
                  opacity: { duration: 0.3 },
                  y: { duration: 0.3 },
                  scale: { duration: 0.6, delay: 0.1 },
                }}
              >
                <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 mb-2 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-bold text-white">
                        #{crypto.cmcRank}
                      </div>
                      {rankChange.direction !== "neutral" && (
                        <motion.div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            rankChange.direction === "up"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {rankChange.direction === "up" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                          <span>{rankChange.change}</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-lg">
                          {crypto.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({crypto.symbol})
                        </span>
                        <div
                          className={`flex items-center space-x-1 ${
                            isPositive ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {crypto.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Price: {formatPrice(crypto.price)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-bold text-xl">
                      {formatMarketCap(crypto.marketCap)}
                    </div>
                    <div className="text-gray-400 text-sm">Market Cap</div>
                  </div>
                </div>

                {/* Animated bar background with price direction indicator */}
                <motion.div
                  className={`absolute top-0 left-0 h-full rounded-lg opacity-20 ${
                    priceDirection === "up"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : priceDirection === "down"
                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${percentage}%`,
                    opacity:
                      priceDirection !== "neutral" ? [0.2, 0.6, 0.2] : 0.2,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    opacity:
                      priceDirection !== "neutral"
                        ? {
                            duration: 0.8,
                            repeat: 2,
                            repeatType: "reverse",
                          }
                        : undefined,
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
