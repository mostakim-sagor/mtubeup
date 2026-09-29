import Link from "next/link";
import { APP_CONFIG, pageHref } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-name">{APP_CONFIG.appName}</span>
            <p className="muted">A fast, minimal media downloader. No accounts, no database, no clutter.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/~">Home</Link>
            <Link href={pageHref("api")}>API</Link>
            <Link href={pageHref("support")}>Support</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href={pageHref("terms")}>Terms</Link>
            <Link href={pageHref("privacy")}>Privacy</Link>
          </div>
          <div className="footer-col">
            <h4>Platforms</h4>
            <span className="muted">YouTube, TikTok, Instagram &amp; more</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} {APP_CONFIG.appName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
