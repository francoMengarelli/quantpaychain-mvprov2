"use client";

import { memo } from "react";
import { Navbar } from "./navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayoutComponent({ children }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export const PageLayout = memo(PageLayoutComponent);
