/**
 * M-TUBE — Licensed Provider
 *
 * A thin adapter around a third-party, licensed media API that the
 * operator has agreed terms with. This file intentionally contains NO
 * extraction logic of its own — it only forwards an already-validated
 * URL to MEDIA_PROVIDER_API_URL and normalizes the response shape.
 *
 * Until MEDIA_PROVIDER_API_URL / MEDIA_PROVIDER_API_KEY are set, every
 * method throws ProviderUnavailableError so the API layer can return a
 * clean, honest "not configured" response instead of faking a result.
 *
 * To connect a real provider: implement the two fetch calls below against
 * that provider's actual documented API. Keep the credential in the
 * environment variable — never in client code.
 */
import { ProviderUnavailableError } from "./provider";
import { fetchWithTimeout } from "../security";

const API_URL = process.env.MEDIA_PROVIDER_API_URL || "";
const API_KEY = process.env.MEDIA_PROVIDER_API_KEY || "";

function isConfigured() {
  return Boolean(API_URL && API_KEY);
}

export const licensedProvider = {
  id: "licensed",

  supports() {
    // A configured licensed provider can attempt any URL; the provider
    // itself is responsible for reporting what it actually supports.
    return isConfigured();
  },

  async getInfo(url) {
    if (!isConfigured()) throw new ProviderUnavailableError();

    const res = await fetchWithTimeout(
      `${API_URL}/info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ url })
      },
      12000
    );

    if (!res.ok) throw new ProviderUnavailableError("The configured media provider could not process this URL.");
    const data = await res.json();

    return {
      title: data.title || "Untitled",
      thumbnail: data.thumbnail || null,
      uploader: data.uploader || null,
      durationSeconds: data.duration ?? null,
      platform: data.platform || "Unknown",
      formats: Array.isArray(data.formats) ? data.formats : []
    };
  },

  async download(url, { format, quality }) {
    if (!isConfigured()) throw new ProviderUnavailableError();

    const res = await fetchWithTimeout(
      `${API_URL}/download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ url, format, quality })
      },
      20000
    );

    if (!res.ok) throw new ProviderUnavailableError("The configured media provider could not fulfill this request.");
    const data = await res.json();

    if (!data.downloadUrl) throw new ProviderUnavailableError();

    return {
      downloadUrl: data.downloadUrl,
      format,
      quality,
      sizeLabel: data.sizeLabel || null
    };
  }
};
