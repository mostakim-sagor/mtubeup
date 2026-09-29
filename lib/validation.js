/**
 * M-TUBE — Request Validation Schemas
 */
import { z } from "zod";

export const InfoRequestSchema = z.object({
  url: z.string().trim().min(1, "URL is required").max(2048, "URL is too long")
});

export const DownloadRequestSchema = z.object({
  url: z.string().trim().min(1, "URL is required").max(2048, "URL is too long"),
  format: z.literal("mp4").default("mp4"),
  quality: z.string().trim().min(1).max(16).default("original")
});

/**
 * Parses and validates a JSON request body against a schema, returning a
 * uniform { data } | { error } result instead of throwing — callers stay
 * simple and error messages stay user-friendly.
 */
export async function parseJsonBody(request, schema) {
  let json;
  try {
    json = await request.json();
  } catch {
    return { error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } };
  }

  const result = schema.safeParse(json);
  if (!result.success) {
    const first = result.error.issues[0];
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: first ? `${first.path.join(".") || "body"}: ${first.message}` : "Invalid request."
      }
    };
  }
  return { data: result.data };
}
