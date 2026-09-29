/**
 * M-TUBE — Query-Parameter Page Engine
 * There are no nested physical routes for Download/Settings/API/etc.
 * A single root route reads the search params and picks a page.
 */
export const RECOGNIZED_PAGES = [
  "download",
  "downloads",
  "finished",
  "settings",
  "api",
  "support",
  "terms",
  "privacy"
];

/**
 * @param {Record<string, string | string[] | undefined>} searchParams
 * @returns {{ page: string, isEmpty: boolean }}
 *   page: "home" or one of RECOGNIZED_PAGES
 *   isEmpty: true when the URL had no query string at all (used to decide
 *   whether to redirect "/" to the canonical "/~" home route)
 */
export function resolvePage(searchParams) {
  const keys = Object.keys(searchParams || {});
  if (keys.length === 0) {
    return { page: "home", isEmpty: true };
  }
  const match = RECOGNIZED_PAGES.find((p) => keys.includes(p));
  return { page: match || "home", isEmpty: false };
}
