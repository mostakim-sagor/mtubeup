/**
 * M-TUBE — Provider Interface
 *
 * Every media provider (licensed API, owned-content passthrough, etc.)
 * implements this shape. The API routes only ever talk to this interface
 * — they never know or care which concrete provider is behind it.
 *
 * @typedef {Object} MediaFormat
 * @property {string} type          "video" | "audio"
 * @property {string} quality       e.g. "1080p", "720p", "mp3"
 * @property {string} [sizeLabel]   Human-readable size, if known
 * @property {string} [container]   e.g. "mp4", "m4a"
 *
 * @typedef {Object} MediaInfo
 * @property {string} title
 * @property {string} [thumbnail]
 * @property {string} [uploader]
 * @property {number} [durationSeconds]
 * @property {string} platform
 * @property {MediaFormat[]} formats
 *
 * @typedef {Object} DownloadResult
 * @property {string} downloadUrl   A URL the client can fetch the media from
 * @property {string} format
 * @property {string} quality
 * @property {string} [sizeLabel]
 *
 * @typedef {Object} MediaProvider
 * @property {string} id                                   Stable provider id
 * @property {(url: string) => boolean} supports            Can this provider handle the URL?
 * @property {(url: string) => Promise<MediaInfo>} getInfo   Fetch metadata
 * @property {(url: string, options: {format: string, quality: string}) => Promise<DownloadResult>} download
 */

/** Thrown by providers when a URL is recognized but cannot be served. */
export class ProviderUnavailableError extends Error {
  constructor(message = "No compatible media provider is configured for this URL.") {
    super(message);
    this.code = "PROVIDER_NOT_CONFIGURED";
  }
}

export {};
