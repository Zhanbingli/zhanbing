import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "占兵的技术博客 | ZhanBing.site",
    template: "%s | 占兵的技术博客"
  },
  description: "分享前端开发、技术学习和编程心得的个人博客",
  keywords: ["前端开发", "技术博客", "JavaScript", "React", "Next.js", "编程"],
  authors: [{ name: "占兵", url: "https://zhanbing.site" }],
  creator: "占兵",
  publisher: "占兵",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zhanbing.site"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "RSS Feed" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zhanbing.site",
    title: "占兵的技术博客",
    description: "分享前端开发、技术学习和编程心得的个人博客",
    siteName: "占兵的技术博客",
  },
  twitter: {
    card: "summary_large_image",
    title: "占兵的技术博客",
    description: "分享前端开发、技术学习和编程心得的个人博客",
  },
  robots: {
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "KNmQ1cf-fuZrRppfB1i8skQXbuEpBj4fgY_JDpRMo0k",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
