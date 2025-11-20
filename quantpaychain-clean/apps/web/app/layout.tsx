import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";
import { Web3Provider } from "@/providers/web3-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "QuantPay Chain - Post-Quantum RWA Tokenization",
  description: "Enterprise platform for real-world asset tokenization with post-quantum security",
  keywords: ["blockchain", "tokenization", "RWA", "post-quantum", "ISO 20022", "DeFi"],
  authors: [{ name: "Franco Mengarelli" }],
  openGraph: {
    title: "QuantPay Chain",
    description: "Post-Quantum RWA Tokenization Platform",
    url: "https://quantpaychain.com",
    siteName: "QuantPay Chain",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantPay Chain",
    description: "Post-Quantum RWA Tokenization Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
