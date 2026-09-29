import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export default function Privacy() {
  return (
    <div className="container">
      <div className="card card-pad legal-doc" style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className="muted" style={{ fontSize: 12.5 }}>Last updated: {APP_CONFIG.legal.lastUpdated}</p>

        <h2>1. No Account Required</h2>
        <p>{APP_CONFIG.appName} does not require an account, so we do not collect names, emails, or passwords.</p>

        <h2>2. No Permanent User Database</h2>
        <p>There is no server-side database of users or their activity. The application does not persist your requests beyond what&apos;s needed to serve them.</p>

        <h2>3. Browser-Side History &amp; Settings</h2>
        <p>Records of your active and finished downloads, and your preferences, are kept only in your browser&apos;s local storage on this device. They are never sent to a server for storage.</p>

        <h2>4. Server Request Processing</h2>
        <p>When you submit a URL, it is sent to the API to be validated and, if a provider is configured, forwarded to that provider to fetch metadata or a download link. This happens per-request and is not logged with identifying information beyond standard server logs.</p>

        <h2>5. Temporary Processing Data</h2>
        <p>Any temporary data created while fulfilling a request (e.g. in-memory rate-limit counters) is not persisted and is cleared automatically.</p>

        <h2>6. Cookies</h2>
        <p>This application does not set tracking cookies.</p>

        <h2>7. Third-Party Providers</h2>
        <p>If a media provider is connected, your submitted URL is forwarded to that provider under their own terms and privacy practices. We do not control third-party providers&apos; data handling.</p>

        <h2>8. Data Security</h2>
        <p>Provider credentials are kept server-side as environment variables and are never exposed in frontend code, browser storage, or this repository.</p>

        <h2>9. No Selling of Personal Information</h2>
        <p>We do not sell personal information, in part because we do not collect any to begin with.</p>

        <h2>10. Contact</h2>
        <p>Questions about this policy can be sent through the <Link className="link-plain" href="/?support">Support</Link> page.</p>

        <Link href="/~" className="btn btn-primary btn-block" style={{ marginTop: 22 }}>I Agree</Link>
      </div>
    </div>
  );
}
