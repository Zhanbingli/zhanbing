import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zhanbing Li | zhanbing.site",
    template: "%s | Zhanbing Li"
  },
  description: "Personal notes on frontend engineering, learning systems, product building, and writing.",
  keywords: ["Zhanbing Li", "frontend", "engineering blog", "learning systems", "React", "Next.js", "writing"],
  authors: [{ name: "Zhanbing Li", url: "https://zhanbing.site" }],
  creator: "Zhanbing Li",
  publisher: "Zhanbing Li",
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
    locale: "en_US",
    url: "https://zhanbing.site",
    title: "Zhanbing Li",
    description: "Personal notes on frontend engineering, learning systems, product building, and writing.",
    siteName: "Zhanbing Li",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Zhanbing Li personal blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zhanbing Li",
    description: "Personal notes on frontend engineering, learning systems, product building, and writing.",
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
    <html lang="en">
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
