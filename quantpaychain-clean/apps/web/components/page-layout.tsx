"use client";

import { Navbar } from "./navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
