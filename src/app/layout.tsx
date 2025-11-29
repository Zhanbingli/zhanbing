import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "zhanbing | ZhanBing.site",
    template: "%s | zhanbing"
  },
  description: "A personal blog sharing frontend development, learning notes, and programming thoughts.",
  keywords: ["frontend", "tech blog", "JavaScript", "React", "Next.js", "coding"],
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
      "application/rss+xml": [{ url: "/feed.xml", title: "RSS Feed" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zhanbing.site",
    title: "zhanbing",
    description: "A personal blog sharing frontend development, learning notes, and programming thoughts.",
    siteName: "zhanbing",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "zhanbing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "zhanbing",
    description: "A personal blog sharing frontend development, learning notes, and programming thoughts.",
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
