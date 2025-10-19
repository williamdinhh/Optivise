import type { Metadata } from "next";
import "./globals.css";
import StatsigProvider from "@/components/StatsigProvider";

export const metadata: Metadata = {
  title: "AI A/B Testing Platform",
  description: "AI-powered A/B testing with Statsig real-time analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StatsigProvider>
          {children}
        </StatsigProvider>
      </body>
    </html>
  );
}
