import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Growkaro | Quality Product Ad Optimization",
  description: "Target-ad optimization platform with GrowScore performance meters, guides, and UCB reinforcement learning analytics."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
