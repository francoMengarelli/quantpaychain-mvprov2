import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "QuantPay Chain - Enterprise Post-Quantum Blockchain Protocol",
  description: "Institutional-grade blockchain protocol combining NIST-approved post-quantum cryptography, RWA tokenization, and ISO 20022 interoperability for the future of digital finance.",
  keywords: ["post-quantum cryptography", "RWA tokenization", "ISO 20022", "institutional blockchain", "digital assets", "smart contracts", "enterprise DeFi", "quantum-resistant", "security tokens", "CRYSTALS-Dilithium"],
  authors: [{ name: "QuantPay Chain" }],
  openGraph: {
    title: "QuantPay Chain - Enterprise Post-Quantum Blockchain Protocol",
    description: "The only blockchain protocol combining NIST-approved post-quantum cryptography, RWA tokenization, and ISO 20022 interoperability for institutional finance.",
    type: "website",
    url: "https://www.quantpaychain.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantPay Chain - Post-Quantum Finance",
    description: "Enterprise-grade blockchain with quantum-resistant security, RWA tokenization, and traditional finance interoperability.",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // DEMO MODE: Session handling moved to client-side to avoid server-side database dependencies
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}