import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI A/B Testing Platform",
  description: "AI-powered A/B testing with synthetic user data and terminal analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
