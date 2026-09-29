/**
 * M-TUBE's dependency override for twitter-downloader.
 *
 * @media-downloaders/v2 requires this package for X/Twitter URLs, but the
 * upstream tarball is blocked by the package firewall. Failing closed keeps
 * npm install reproducible and never manufactures a media URL.
 */
async function TwitterDL() {
  throw new Error("X/Twitter downloads are not available in this installation.");
}

module.exports = { TwitterDL };