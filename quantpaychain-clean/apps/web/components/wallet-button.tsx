"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  
  // Intentar obtener el config de Wagmi
  let hasWagmi = false;
  try {
    useConfig();
    hasWagmi = true;
  } catch {
    hasWagmi = false;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // No renderizar si no está montado o no hay WagmiProvider
  if (!mounted || !hasWagmi) {
    return null;
  }

  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
    />
  );
}
