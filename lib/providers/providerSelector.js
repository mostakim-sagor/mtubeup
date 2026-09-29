/**
 * M-TUBE — Provider Selector
 * Decides which configured provider, if any, should handle a given URL.
 * The API routes call this instead of importing a specific provider —
 * swapping or adding providers never touches route code.
 */
import { licensedProvider } from "./licensedProvider";
import { ownedContentProvider } from "./ownedContentProvider";
import { mockProvider } from "./mockProvider";

// Order matters: more specific/trusted providers are tried first.
const PROVIDERS = [ownedContentProvider, licensedProvider, mockProvider];

/**
 * @param {string} url
 * @returns {import("./provider").MediaProvider | null}
 */
export function selectProvider(url) {
  return PROVIDERS.find((provider) => provider.supports(url)) || null;
}

export function listProviders() {
  return PROVIDERS.map((p) => ({ id: p.id }));
}
