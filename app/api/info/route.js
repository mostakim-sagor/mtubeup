import { NextResponse } from "next/server";
import { InfoRequestSchema, parseJsonBody } from "@/lib/validation";
import { assertSafeUrl, toSafeErrorResponse, SafeError } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getMediaInfo } from "@/lib/downloader";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      throw new SafeError("RATE_LIMITED", "Too many requests. Please slow down and try again shortly.", 429);
    }

    const { data, error } = await parseJsonBody(request, InfoRequestSchema);
    if (error) throw new SafeError(error.code, error.message, 400);

    const parsedUrl = assertSafeUrl(data.url);
    const info = await getMediaInfo(parsedUrl.href);
    return NextResponse.json({
      success: true,
      provider: info.provider,
      platform: info.platform,
      title: info.title,
      thumbnail: info.thumbnail,
      uploader: info.uploader,
      duration: info.duration,
      formats: info.formats,
      isMock: false
    });
  } catch (err) {
    const safe = toSafeErrorResponse(err);
    return NextResponse.json(safe, { status: safe.status || 400 });
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST with a JSON body: { url }." },
    { status: 405 }
  );
}
