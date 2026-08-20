import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rocky Liu — Visual Designer",
  description: "Rocky Liu，跨境电商品牌视觉经理，专注品牌视觉、营销内容与 AI 创意生产。",
  metadataBase: new URL("https://rocky-liu-portfolio.openai.site"),
  openGraph: {
    title: "Rocky Liu — 视觉经理",
    description: "超 10 年品牌视觉与电商体系搭建经验。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rocky Liu — 视觉经理",
    description: "品牌视觉、电商体系与 AI 创意生产。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
