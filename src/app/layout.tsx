import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crace",
  description:
    "Watch cryptocurrencies compete for the top market cap positions in real-time",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Crace",
  },
  icons: {
    icon: [
      {
        url: "/CraceLogo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        url: "/icons/android/android-launchericon-48-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-72-72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-96-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-144-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/macos/crace-macos-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/icons/ios/180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/ios/192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/ios/512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1f2937",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Crace" />
        <meta name="application-name" content="Crace" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/ios/180.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/ios/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/ios/180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/ios/167.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/ios/32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/ios/16.png"
        />
        <link rel="mask-icon" href="/icons/ios/180.png" color="#1f2937" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
