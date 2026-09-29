import { NextResponse } from "next/server";
export const runtime = "nodejs";

/**
 * Downloads stream directly from POST /api/download. There is no server-side
 * job store or custom download folder to query.
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Downloads stream directly from POST /api/download.", code: "DOWNLOAD_STATUS_UNAVAILABLE" },
    { status: 410 }
  );
}
