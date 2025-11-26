"use client";

import { Web3Provider } from "@/providers/web3-provider";

export default function Web3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Web3Provider>{children}</Web3Provider>;
}
