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
  title: "QuantPay Chain - Tokenización de Activos del Mundo Real",
  description: "Plataforma empresarial líder para tokenización de activos del mundo real (RWA) con seguridad post-cuántica, cumplimiento ISO 20022 y dividendos automáticos.",
  keywords: ["blockchain", "tokenización", "RWA", "real world assets", "post-quantum", "ISO 20022", "DeFi", "dividendos", "inversión", "criptomonedas", "seguridad cuántica"],
  authors: [{ name: "QuantPayChain" }],
  creator: "QuantPayChain",
  publisher: "QuantPayChain",
  manifest: "/manifest.json",
  metadataBase: new URL("https://www.quantpaychain.com"),
  alternates: {
    canonical: "https://www.quantpaychain.com",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QuantPayChain",
  },
  openGraph: {
    title: "QuantPay Chain - Tokenización de Activos del Mundo Real",
    description: "Plataforma empresarial líder para tokenización de activos con seguridad post-cuántica y cumplimiento ISO 20022.",
    url: "https://www.quantpaychain.com",
    siteName: "QuantPay Chain",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuantPay Chain - El Futuro de la Tokenización",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantPay Chain - Tokenización Post-Cuántica",
    description: "Plataforma empresarial para tokenización de activos del mundo real con seguridad post-cuántica.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-codigo-de-verificacion-google",
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
