"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-32 bg-purple-500/20 rounded-lg animate-pulse" />
    );
  }

  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
    />
  );
}
