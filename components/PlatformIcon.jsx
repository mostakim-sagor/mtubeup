/**
 * M-TUBE — Platform Icons
 * Original, simplified monoline glyphs (not brand logos).
 */
const ICONS = {
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="4" /><path d="M11 10l4 2-4 2z" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v10.5a3.5 3.5 0 11-3-3.46" /><path d="M14 3c.5 2.5 2.3 4.2 5 4.5" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 8h-2a2 2 0 00-2 2v10M9 13h4" /><circle cx="12" cy="12" r="9" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  ),
  drive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10l5 9-5 9H7l-5-9z" /><path d="M2 12h20" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M10 17c1-3 1.2-6 2-8.5.6-1.7 3-1.5 3 .3 0 1.6-1 4-3 4.2" />
    </svg>
  ),
  likee: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 8.6c0 5-8.8 10.6-8.8 10.6S3.2 13.6 3.2 8.6a4.8 4.8 0 018.8-2.6 4.8 4.8 0 018.8 2.6z" />
    </svg>
  ),
  threads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v0c4.5 0 7 2.7 7 7.3 0 5.8-3 10.2-7 10.2s-6.5-3-6.8-6.6c-.3-3.6 1.8-5.4 4.8-5.4 2.5 0 4 1.3 4 3.3 0 1.6-1 2.7-2.6 2.7-1 0-1.7-.5-1.7-1.4" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M7 10.5c3-1 7-.7 9.5.8M7.5 13.5c2.5-.8 5.8-.6 8 .7M8 16.3c2-.6 4.6-.4 6.3.6" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 15v-2M6 15v-4M9 15V8M12 15V6M15 15v-6a3 3 0 013-3 3 3 0 013 3 2.5 2.5 0 012 2.5c0 1.8-1.4 3.5-3.2 3.5H15" />
    </svg>
  ),
  terabox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8" /><line x1="12" y1="13" x2="12" y2="21" />
    </svg>
  ),
  capcut: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><path d="M8 7.5L19 18M19 6L8 16.5" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3L2 11l6 2m14-10l-4 18-8-6m12-12L8 13" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="7" width="16" height="12" rx="4" /><circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" /><path d="M8 7l1-3h6l1 3" />
    </svg>
  )
};

export default function PlatformIcon({ name, className }) {
  return (
    <span className={className || "platform-icon"}>{ICONS[name] || ICONS.youtube}</span>
  );
}
