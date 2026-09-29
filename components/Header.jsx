"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { APP_CONFIG, pageHref } from "@/lib/config";
import Logo from "./Logo";

const NAV_LINKS = [
  { key: "home", label: "Home" },
  { key: "downloads", label: "Downloads" },
  { key: "finished", label: "Finished" },
  { key: "api", label: "API" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeKey = pathname === "/~" || (pathname === "/" && searchParams.toString() === "")
    ? "home"
    : NAV_LINKS.find((n) => searchParams.has(n.key))?.key;

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/~" className="brand">
          <Logo />
          <span className="brand-text">
            <span className="brand-name">{APP_CONFIG.appName}</span>
            <span className="brand-powered">POWER BY : {APP_CONFIG.poweredBy}</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {NAV_LINKS.map((n) => (
            <Link key={n.key} href={pageHref(n.key)} className={activeKey === n.key ? "active" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions" style={{ position: "relative" }}>
          <Link href={pageHref("support")} className="btn btn-secondary btn-sm header-support-btn">
            Support
          </Link>
          <Link href={pageHref("settings")} className="icon-btn" aria-label="Settings">
            <SettingsIcon />
          </Link>
          <button
            className="icon-btn menu-btn"
            aria-label="Open menu"
            aria-haspopup="true"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon />
          </button>
          <div className={`dropdown-menu${menuOpen ? " open" : ""}`}>
            <Link href={pageHref("api")} onClick={() => setMenuOpen(false)}>
              <ApiIcon /> API
            </Link>
            <Link href={pageHref("support")} onClick={() => setMenuOpen(false)}>
              <SupportIcon /> Support
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function ApiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
