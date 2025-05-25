import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "展兵的个人博客",
    template: "%s | 展兵的个人博客"
  },
  description: "分享技术心得、学习笔记和生活感悟的个人博客",
  keywords: ["博客", "技术", "编程", "学习", "分享", "展兵"],
  authors: [{ name: "展兵" }],
  creator: "展兵",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zhanbing.site",
    title: "展兵的个人博客",
    description: "分享技术心得、学习笔记和生活感悟的个人博客",
    siteName: "展兵的个人博客",
  },
  twitter: {
    card: "summary_large_image",
    title: "展兵的个人博客",
    description: "分享技术心得、学习笔记和生活感悟的个人博客",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
