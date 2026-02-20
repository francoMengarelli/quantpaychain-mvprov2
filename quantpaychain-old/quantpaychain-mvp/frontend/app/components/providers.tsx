
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi-config";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}

export function Providers({ children, session }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors position="top-right" />
            </ThemeProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
