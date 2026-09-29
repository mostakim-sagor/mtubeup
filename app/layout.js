import "./globals.css";
import { Suspense } from "react";
import { APP_CONFIG } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  metadataBase: undefined, // Left unset: this project intentionally avoids hard-coding a production domain.
  title: {
    default: APP_CONFIG.seo.title,
    template: `%s — ${APP_CONFIG.appName}`
  },
  description: APP_CONFIG.seo.description,
  applicationName: APP_CONFIG.appName,
  icons: {
    icon: APP_CONFIG.logoSrc
  },
  openGraph: {
    title: APP_CONFIG.seo.title,
    description: APP_CONFIG.seo.description,
    siteName: APP_CONFIG.appName,
    type: "website"
  },
  twitter: {
    card: "summary",
    title: APP_CONFIG.seo.title,
    description: APP_CONFIG.seo.description
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f6fed"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="page-main">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
