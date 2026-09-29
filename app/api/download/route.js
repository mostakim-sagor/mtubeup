import { NextResponse } from "next/server";
import { DownloadRequestSchema, parseJsonBody } from "@/lib/validation";
import { assertSafeUrl, toSafeErrorResponse, SafeError } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createDownloadStream, downloadMedia } from "@/lib/downloader";
import { Readable } from "node:stream";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      throw new SafeError("RATE_LIMITED", "Too many requests. Please slow down and try again shortly.", 429);
    }

    const { data, error } = await parseJsonBody(request, DownloadRequestSchema);
    if (error) throw new SafeError(error.code, error.message, 400);

    const parsedUrl = assertSafeUrl(data.url);

    const download = await downloadMedia(parsedUrl.href);
    const stream = createDownloadStream(download);

    if (!stream) {
      await download.cleanup();
      throw new SafeError("DOWNLOAD_FAILED", "The generated file is no longer available.");
    }

    return new NextResponse(Readable.toWeb(stream), {
      headers: {
        "Content-Type": download.contentType,
        "Content-Length": String(download.size),
        "Content-Disposition": `attachment; filename="${download.filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (err) {
    const safe = toSafeErrorResponse(err);
    return NextResponse.json(safe, { status: safe.status || 400 });
  }
}

export async function GET(request) {
  return NextResponse.json(
    { success: false, error: "Use POST with a JSON body. The response is the real downloadable file." },
    { status: 405 }
  );
}
