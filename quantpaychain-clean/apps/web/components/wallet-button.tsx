"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const [hasWagmi, setHasWagmi] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verificar si estamos dentro de un WagmiProvider
    try {
      // Intentar importar useConfig y verificar si está disponible
      import('wagmi').then((wagmi) => {
        try {
          // Si useConfig no arroja error, estamos dentro del provider
          setHasWagmi(true);
        } catch {
          setHasWagmi(false);
        }
      });
    } catch {
      setHasWagmi(false);
    }
  }, []);

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
