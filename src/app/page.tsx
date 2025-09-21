"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RotateCcw, Settings } from "lucide-react";
import BarChartRace from "@/components/BarChartRace";
import FilterControls from "@/components/FilterControls";
import { useUrlState } from "@/hooks/useUrlState";

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

  // Stable serialize/deserialize functions
  const serializeRange = useCallback(
    (value: [number, number]) => `${value[0]},${value[1]}`,
    []
  );
  const deserializeRange = useCallback((value: string) => {
    const [min, max] = value.split(",").map(Number);
    return [min || 0, max || Number.MAX_SAFE_INTEGER] as [number, number];
  }, []);

  const serializeArray = useCallback((value: string[]) => value.join(","), []);
  const deserializeArray = useCallback(
    (value: string) => (value ? value.split(",").filter(Boolean) : []),
    []
  );

  // URL state management
  const [selectedCategories, setSelectedCategories] = useUrlState<string[]>(
    "categories",
    [],
    serializeArray,
    deserializeArray
  );

  const [searchQuery, setSearchQuery] = useUrlState<string>("search", "");
  const [marketCapRange, setMarketCapRange] = useUrlState<[number, number]>(
    "marketCap",
    [0, Number.MAX_SAFE_INTEGER],
    serializeRange,
    deserializeRange
  );
  const [priceRange, setPriceRange] = useUrlState<[number, number]>(
    "price",
    [0, Number.MAX_SAFE_INTEGER],
    serializeRange,
    deserializeRange
  );
  const [showGainers, setShowGainers] = useUrlState<boolean>("gainers", false);
  const [showLosers, setShowLosers] = useUrlState<boolean>("losers", false);

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

  // No auto-selection needed for categories - users can select manually

  const handleReset = () => {
    fetchCryptoData();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  // Helper function to determine crypto category based on name/symbol
  const getCryptoCategory = (crypto: CryptoData): string[] => {
    const categories: string[] = [];
    const name = crypto.name.toLowerCase();
    const symbol = crypto.symbol.toLowerCase();

    // DeFi tokens
    if (
      name.includes("defi") ||
      name.includes("uniswap") ||
      name.includes("compound") ||
      name.includes("aave") ||
      name.includes("maker") ||
      name.includes("curve") ||
      symbol.includes("uni") ||
      symbol.includes("comp") ||
      symbol.includes("mkr")
    ) {
      categories.push("DeFi");
    }

    // Layer 1
    if (
      name.includes("ethereum") ||
      name.includes("bitcoin") ||
      name.includes("cardano") ||
      name.includes("solana") ||
      name.includes("avalanche") ||
      name.includes("polkadot") ||
      symbol === "eth" ||
      symbol === "btc" ||
      symbol === "ada" ||
      symbol === "sol" ||
      symbol === "avax" ||
      symbol === "dot"
    ) {
      categories.push("Layer 1");
    }

    // Layer 2
    if (
      name.includes("polygon") ||
      name.includes("arbitrum") ||
      name.includes("optimism") ||
      name.includes("loopring") ||
      name.includes("immutable") ||
      symbol === "matic" ||
      symbol === "arb" ||
      symbol === "op" ||
      symbol === "lrc" ||
      symbol === "imx"
    ) {
      categories.push("Layer 2");
    }

    // Stablecoins
    if (
      name.includes("tether") ||
      name.includes("usd coin") ||
      name.includes("dai") ||
      name.includes("binance usd") ||
      name.includes("frax") ||
      symbol === "usdt" ||
      symbol === "usdc" ||
      symbol === "dai" ||
      symbol === "busd" ||
      symbol === "frax"
    ) {
      categories.push("Stablecoin");
    }

    // Meme coins
    if (
      name.includes("dogecoin") ||
      name.includes("shiba") ||
      name.includes("pepe") ||
      name.includes("floki") ||
      name.includes("bonk") ||
      symbol === "doge" ||
      symbol === "shib" ||
      symbol === "pepe" ||
      symbol === "floki" ||
      symbol === "bonk"
    ) {
      categories.push("Meme");
    }

    // Gaming
    if (
      name.includes("axie") ||
      name.includes("sandbox") ||
      name.includes("decentraland") ||
      name.includes("enjin") ||
      name.includes("gala") ||
      symbol === "axs" ||
      symbol === "sand" ||
      symbol === "mana" ||
      symbol === "enj" ||
      symbol === "gala"
    ) {
      categories.push("Gaming");
    }

    // NFT
    if (
      name.includes("nft") ||
      name.includes("opensea") ||
      name.includes("blur") ||
      symbol === "nft" ||
      symbol === "blur"
    ) {
      categories.push("NFT");
    }

    // Metaverse
    if (
      name.includes("metaverse") ||
      name.includes("virtual") ||
      name.includes("vr") ||
      name.includes("augmented") ||
      name.includes("ar")
    ) {
      categories.push("Metaverse");
    }

    // AI & Big Data
    if (
      name.includes("artificial") ||
      name.includes("ai") ||
      name.includes("machine learning") ||
      name.includes("data") ||
      name.includes("analytics") ||
      symbol.includes("ai") ||
      symbol.includes("data")
    ) {
      categories.push("AI & Big Data");
    }

    // Privacy
    if (
      name.includes("privacy") ||
      name.includes("monero") ||
      name.includes("zcash") ||
      name.includes("secret") ||
      name.includes("incognito") ||
      symbol === "xmr" ||
      symbol === "zec" ||
      symbol === "scrt" ||
      symbol === "inc"
    ) {
      categories.push("Privacy");
    }

    // Exchange Token
    if (
      name.includes("binance") ||
      name.includes("coinbase") ||
      name.includes("kraken") ||
      name.includes("huobi") ||
      name.includes("kucoin") ||
      symbol === "bnb" ||
      symbol === "coin" ||
      symbol === "ht" ||
      symbol === "kcs"
    ) {
      categories.push("Exchange Token");
    }

    // Infrastructure
    if (
      name.includes("chainlink") ||
      name.includes("the graph") ||
      name.includes("filecoin") ||
      name.includes("ipfs") ||
      name.includes("arweave") ||
      symbol === "link" ||
      symbol === "grt" ||
      symbol === "fil" ||
      symbol === "ar"
    ) {
      categories.push("Infrastructure");
    }

    // Oracle
    if (
      name.includes("oracle") ||
      name.includes("chainlink") ||
      name.includes("band") ||
      symbol === "link" ||
      symbol === "band"
    ) {
      categories.push("Oracle");
    }

    // Storage
    if (
      name.includes("storage") ||
      name.includes("filecoin") ||
      name.includes("arweave") ||
      name.includes("sia") ||
      name.includes("storj") ||
      symbol === "fil" ||
      symbol === "ar" ||
      symbol === "sc" ||
      symbol === "storj"
    ) {
      categories.push("Storage");
    }

    // Interoperability
    if (
      name.includes("cosmos") ||
      name.includes("polkadot") ||
      name.includes("chain") ||
      name.includes("bridge") ||
      name.includes("cross") ||
      symbol === "atom" ||
      symbol === "dot" ||
      symbol.includes("chain")
    ) {
      categories.push("Interoperability");
    }

    return categories;
  };

  // Filter and process crypto data
  const filteredCryptoData = useMemo(() => {
    if (allCryptoData.length === 0) return [];

    const filtered = allCryptoData.filter((crypto) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !crypto.name.toLowerCase().includes(query) &&
          !crypto.symbol.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Filter by categories
      if (selectedCategories.length > 0) {
        const cryptoCategories = getCryptoCategory(crypto);
        const hasMatchingCategory = selectedCategories.some((category) =>
          cryptoCategories.includes(category)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      // Filter by market cap range
      if (
        crypto.marketCap < marketCapRange[0] ||
        crypto.marketCap > marketCapRange[1]
      ) {
        return false;
      }

      // Filter by price range
      if (crypto.price < priceRange[0] || crypto.price > priceRange[1]) {
        return false;
      }

      // Filter by gainers/losers
      if (showGainers && crypto.change24h <= 0) return false;
      if (showLosers && crypto.change24h >= 0) return false;

      return true;
    });

    // Sort by CMC rank and limit to top 20 for the race
    return filtered.sort((a, b) => a.cmcRank - b.cmcRank).slice(0, 20);
  }, [
    allCryptoData,
    searchQuery,
    selectedCategories,
    marketCapRange,
    priceRange,
    showGainers,
    showLosers,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white text-xl mt-4">
            Loading cryptocurrency data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-bold mb-4">
            Error Loading Data
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchCryptoData}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🚀 Crypto Market Cap Race
              </h1>
              <p className="text-gray-400 mt-1">
                Watch cryptocurrencies compete for the top market cap positions
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refresh</span>
              </button>

              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <select
                  value={speed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value={1000}>Fast (1s)</option>
                  <option value={3000}>Normal (3s)</option>
                  <option value={5000}>Slow (5s)</option>
                  <option value={10000}>Very Slow (10s)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allCryptoData.length > 0 ? (
          <>
            <FilterControls
              allCryptoData={allCryptoData}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              marketCapRange={marketCapRange}
              onMarketCapRangeChange={setMarketCapRange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              showGainers={showGainers}
              onShowGainersChange={setShowGainers}
              showLosers={showLosers}
              onShowLosersChange={setShowLosers}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />

            {filteredCryptoData.length > 0 ? (
              <BarChartRace
                data={filteredCryptoData}
                totalCount={allCryptoData.length}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-4">
                  No cryptocurrencies match your current filters
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMarketCapRange([0, Number.MAX_SAFE_INTEGER]);
                    setPriceRange([0, Number.MAX_SAFE_INTEGER]);
                    setShowGainers(false);
                    setShowLosers(false);
                    setSelectedCategories([]);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">
              No cryptocurrency data available
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p>Data provided by CoinMarketCap API</p>
            <p className="text-sm mt-1">
              Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
