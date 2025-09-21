"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "use-debounce";

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

interface FilterControlsProps {
  allCryptoData: CryptoData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  marketCapRange: [number, number];
  onMarketCapRangeChange: (range: [number, number]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showGainers: boolean;
  onShowGainersChange: (show: boolean) => void;
  showLosers: boolean;
  onShowLosersChange: (show: boolean) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function FilterControls({
  allCryptoData,
  searchQuery,
  onSearchChange,
  marketCapRange,
  onMarketCapRangeChange,
  priceRange,
  onPriceRangeChange,
  showGainers,
  onShowGainersChange,
  showLosers,
  onShowLosersChange,
  selectedCategories,
  onCategoriesChange,
}: FilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery] = useDebounce(localSearchQuery, 300);
  const [localMarketCapMin, setLocalMarketCapMin] = useState(
    marketCapRange[0].toString()
  );
  const [localMarketCapMax, setLocalMarketCapMax] = useState(
    marketCapRange[1].toString()
  );
  const [localPriceMin, setLocalPriceMin] = useState(priceRange[0].toString());
  const [localPriceMax, setLocalPriceMax] = useState(priceRange[1].toString());

  // Common cryptocurrency categories
  const categories = [
    "DeFi",
    "Layer 1",
    "Layer 2",
    "Stablecoin",
    "Meme",
    "Gaming",
    "NFT",
    "Metaverse",
    "AI & Big Data",
    "Privacy",
    "Exchange Token",
    "Infrastructure",
    "Oracle",
    "Storage",
    "Interoperability",
  ];

  // Update parent when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      onSearchChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchQuery, onSearchChange]);

  // Sync local input values with prop values
  useEffect(() => {
    setLocalMarketCapMin(marketCapRange[0].toString());
    setLocalMarketCapMax(marketCapRange[1].toString());
  }, [marketCapRange]);

  useEffect(() => {
    setLocalPriceMin(priceRange[0].toString());
    setLocalPriceMax(priceRange[1].toString());
  }, [priceRange]);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAllCategories = () => {
    onCategoriesChange(categories);
  };

  const handleSelectNoCategories = () => {
    onCategoriesChange([]);
  };

  const handleMarketCapMinChange = (value: string) => {
    setLocalMarketCapMin(value);
    const numValue = parseFloat(value) || 0;
    onMarketCapRangeChange([numValue, marketCapRange[1]]);
  };

  const handleMarketCapMaxChange = (value: string) => {
    setLocalMarketCapMax(value);
    const numValue = parseFloat(value) || Number.MAX_SAFE_INTEGER;
    onMarketCapRangeChange([marketCapRange[0], numValue]);
  };

  const handlePriceMinChange = (value: string) => {
    setLocalPriceMin(value);
    const numValue = parseFloat(value) || 0;
    onPriceRangeChange([numValue, priceRange[1]]);
  };

  const handlePriceMaxChange = (value: string) => {
    setLocalPriceMax(value);
    const numValue = parseFloat(value) || Number.MAX_SAFE_INTEGER;
    onPriceRangeChange([priceRange[0], numValue]);
  };

  const formatValue = (value: number, isPrice: boolean = false) => {
    if (isPrice) {
      if (value >= 1000) return `$${value.toFixed(0)}`;
      if (value >= 1) return `$${value.toFixed(2)}`;
      return `$${value.toFixed(6)}`;
    }
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const maxMarketCap = Math.max(...allCryptoData.map((c) => c.marketCap));
  const maxPrice = Math.max(...allCryptoData.map((c) => c.price));

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            Filters & Selection
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        {localSearchQuery && (
          <button
            onClick={() => setLocalSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Quick Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onShowGainersChange(!showGainers)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  showGainers
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                📈 Gainers
              </button>
              <button
                onClick={() => onShowLosersChange(!showLosers)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  showLosers
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                📉 Losers
              </button>
            </div>

            {/* Category Toggle Chips */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categories ({selectedCategories.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategories.includes(category)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleSelectAllCategories}
                  className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNoCategories}
                  className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Market Cap Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Market Cap Range: {formatValue(marketCapRange[0])} -{" "}
              {formatValue(marketCapRange[1])}
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="0"
                  max={maxMarketCap}
                  value={marketCapRange[0]}
                  onChange={(e) =>
                    onMarketCapRangeChange([
                      Number(e.target.value),
                      marketCapRange[1],
                    ])
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max={maxMarketCap}
                  value={marketCapRange[1]}
                  onChange={(e) =>
                    onMarketCapRangeChange([
                      marketCapRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    value={localMarketCapMin}
                    onChange={(e) => handleMarketCapMinChange(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    value={localMarketCapMax}
                    onChange={(e) => handleMarketCapMaxChange(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price Range: {formatValue(priceRange[0], true)} -{" "}
              {formatValue(priceRange[1], true)}
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) =>
                    onPriceRangeChange([Number(e.target.value), priceRange[1]])
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], Number(e.target.value)])
                  }
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={localPriceMin}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    step="0.01"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={localPriceMax}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Max"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
