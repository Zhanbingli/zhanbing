import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "展兵 | zhanbing.site",
    template: "%s | 展兵"
  },
  description: "展兵的个人博客，分享前端开发、学习方法、项目实践和持续写作中的思考。",
  keywords: ["展兵", "前端", "技术博客", "学习方法", "React", "Next.js", "写作"],
  authors: [{ name: "zhanbing", url: "https://zhanbing.site" }],
  creator: "zhanbing",
  publisher: "zhanbing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zhanbing.site"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "RSS 订阅" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zhanbing.site",
    title: "展兵",
    description: "展兵的个人博客，分享前端开发、学习方法、项目实践和持续写作中的思考。",
    siteName: "展兵",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "展兵的个人博客",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "展兵",
    description: "展兵的个人博客，分享前端开发、学习方法、项目实践和持续写作中的思考。",
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
    google: "KNmQ1cf-fuZrRppfB1i8skQXbuEpBj4fgY_JDpRMo0k",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="zh-CN">
      <body className="bg-[var(--background)] text-slate-900 antialiased">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
