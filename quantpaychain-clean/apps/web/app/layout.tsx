import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";
import Script from "next/script";

// Force dynamic rendering for all pages to avoid indexedDB errors
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "QuantPay Chain - Tokenización de Activos Post-Cuántica",
  description: "Plataforma empresarial para tokenización de activos del mundo real con seguridad post-cuántica",
  keywords: ["blockchain", "tokenización", "RWA", "post-quantum", "ISO 20022", "DeFi", "dividendos"],
  authors: [{ name: "Franco Mengarelli" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QuantPayChain",
  },
  openGraph: {
    title: "QuantPay Chain",
    description: "Plataforma de Tokenización de Activos Post-Cuántica",
    url: "https://quantpaychain.com",
    siteName: "QuantPay Chain",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantPay Chain",
    description: "Plataforma de Tokenización de Activos Post-Cuántica",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('✅ SW registered:', registration.scope);
                  },
                  function(err) {
                    console.log('❌ SW registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
