import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sans = Noto_Sans_SC({
  variable: "--font-sans-app",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "知微 - AI命理分析系统",
    template: "%s - AI命理分析系统",
  },
  description: "将传统命理排盘与现代大模型解读结合的极简 AI SaaS 平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${geistMono.variable} ${sans.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
