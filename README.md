# 🚀 Crypto Market Cap Race

A fun and interactive bar chart race visualization showing cryptocurrency market cap rankings in real-time. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Real-time Data**: Fetches live cryptocurrency data from CoinMarketCap API
- **Animated Bar Chart Race**: Smooth animations showing market cap rankings
- **Interactive Controls**: Play, pause, reset, and speed controls
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Dark theme with beautiful gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+
- A CoinMarketCap API key (get one at [coinmarketcap.com/api](https://coinmarketcap.com/api/))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd nanostep
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:

```bash
# Create .env.local file
echo "COINMARKETCAP_API_KEY=your_api_key_here" > .env.local
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Play/Pause**: Click the play button to start the animation or pause it
2. **Reset**: Click reset to refresh the data and restart the animation
3. **Speed Control**: Use the dropdown to adjust animation speed (1s to 5s intervals)
4. **View Details**: Hover over cryptocurrency entries to see more information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: CoinMarketCap Pro API

## API Configuration

The app uses the CoinMarketCap Pro API to fetch real-time cryptocurrency data. Make sure to:

1. Sign up for a free API key at [coinmarketcap.com/api](https://coinmarketcap.com/api/)
2. Add your API key to the `.env.local` file
3. The API fetches the top 20 cryptocurrencies by market cap

## Project Structure

```
src/
├── app/
│   ├── api/crypto/route.ts    # API route for fetching crypto data
│   ├── page.tsx               # Main page component
│   └── layout.tsx             # Root layout
├── components/
│   └── BarChartRace.tsx       # Bar chart race component
└── ...
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
