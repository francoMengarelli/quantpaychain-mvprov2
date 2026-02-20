"use client";

import { memo } from "react";
import { Navbar } from "./navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  showWalletButton?: boolean;
}

function PageLayoutComponent({ children, showWalletButton = false }: PageLayoutProps) {
  return (
    <>
      <Navbar showWalletButton={showWalletButton} />
      {children}
    </>
  );
}

export const PageLayout = memo(PageLayoutComponent);
