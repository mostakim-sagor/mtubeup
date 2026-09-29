import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export default function Terms() {
  return (
    <div className="container">
      <div className="card card-pad legal-doc" style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className="muted" style={{ fontSize: 12.5 }}>Last updated: {APP_CONFIG.legal.lastUpdated}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using {APP_CONFIG.appName}, you agree to these Terms &amp; Conditions. If you do not agree, please do not use this application.</p>

        <h2>2. Use of the Service</h2>
        <p>{APP_CONFIG.appName} is provided for personal, non-commercial use. You agree not to misuse the service or attempt to disrupt its operation.</p>

        <h2>3. Supported Content</h2>
        <p>The application accepts links from a set of supported platforms. Actual availability depends on the source link and the capabilities of the connected downloader.</p>

        <h2>4. User Responsibility</h2>
        <p>You are solely responsible for the content you choose to download and how you use it. Only download content you have permission to download and use.</p>

        <h2>5. Copyright</h2>
        <p>We do not host any content ourselves. Media processed through the service remains the property of its original creators and rights holders.</p>

        <h2>6. Prohibited Abuse</h2>
        <p>You may not use the service to bypass authentication, DRM, paywalls, or access controls, or to download private or unauthorized content.</p>

        <h2>7. Public API Usage</h2>
        <p>The public API is offered without individual API keys. Access is scoped to the domain the API is deployed on and protected by rate limiting. Automated or excessive use may be restricted.</p>

        <h2>8. Service Availability</h2>
        <p>The service is provided &quot;as is&quot; and may be interrupted, modified, or discontinued at any time without prior notice. There is no guarantee of permanent availability for any given platform.</p>

        <h2>9. Third-Party Platform Limitations</h2>
        <p>Third-party platforms change frequently. We make no guarantee that any specific platform will remain supported.</p>

        <h2>10. Limitation of Liability</h2>
        <p>We are not responsible for any loss or damage arising from your use of this application, to the fullest extent permitted by law.</p>

        <h2>11. Changes to Terms</h2>
        <p>These Terms may be updated periodically. Continued use of the service after changes constitutes acceptance of the revised Terms.</p>

        <h2>12. Contact</h2>
        <p>Questions can be sent through the <Link className="link-plain" href="/?support">Support</Link> page.</p>

        <Link href="/~" className="btn btn-primary btn-block" style={{ marginTop: 22 }}>I Agree</Link>
      </div>
    </div>
  );
}
