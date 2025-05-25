import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "blog of lizhanbing",
    template: "%s | blog of lizhanbing"
  },
  description: "分享技术心得、学习笔记和生活感悟的个人博客",
  keywords: ["博客", "技术", "编程", "学习", "分享", "lizhanbing", "前端", "后端", "全栈开发"],
  authors: [{ name: "lizhanbing", url: "https://zhanbing.site" }],
  creator: "lizhanbing",
  publisher: "lizhanbing",
  metadataBase: new URL("https://zhanbing.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zhanbing.site",
    title: "blog of lizhanbing",
    description: "分享技术心得、学习笔记和生活感悟的个人博客",
    siteName: "blog of lizhanbing",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "blog of lizhanbing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "blog of lizhanbing",
    description: "分享技术心得、学习笔记和生活感悟的个人博客",
    images: ["/og-image.svg"],
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
    google: "your-google-verification-code", // 需要替换为实际的验证码
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
