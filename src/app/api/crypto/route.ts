import { NextResponse } from "next/server";

export async function GET() {
  console.log("API route called at:", new Date().toISOString());
  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CoinMarketCap API key not found" },
      { status: 500 }
    );
  }

  try {
    console.log("Fetching from CoinMarketCap API...");
    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=500&sort=market_cap",
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data from CoinMarketCap:", data.data.length, "items");

    // Transform the data to include only what we need for the bar chart race
    const cryptoData = data.data.map(
      (crypto: {
        id: number;
        name: string;
        symbol: string;
        cmc_rank: number;
        quote: {
          USD: {
            market_cap: number;
            price: number;
            percent_change_24h: number;
            volume_24h: number;
          };
        };
      }) => {
        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          cmcRank: crypto.cmc_rank,
          marketCap: crypto.quote.USD.market_cap,
          price: crypto.quote.USD.price,
          change24h: crypto.quote.USD.percent_change_24h,
          volume24h: crypto.quote.USD.volume_24h,
        };
      }
    );

    console.log("Returning transformed data:", cryptoData.length, "items");
    return NextResponse.json(cryptoData);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency data" },
      { status: 500 }
    );
  }
}
