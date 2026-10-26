import copy from "@/data/contact.json";
import { contactSchema } from "@/schemas/contact.schema";
import { getContactConfig } from "@/lib/contact-config";
import { verifyTurnstile } from "@/lib/turnstile";
import { EmailDeliveryError, sendContactEmail } from "@/lib/email";
import { saveContactToSheet, SheetsDeliveryError } from "@/lib/google-sheets";
import { PayloadTooLargeError, readLimitedJson } from "@/lib/request-body";
export const runtime = "nodejs";
export const maxDuration = 30;
function response(status: number, message: string, success = false) {
  return Response.json({ success, message }, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) } });
}
export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return response(400, copy.malformed);
  let input: unknown;
  try { input = await readLimitedJson(request); }
  catch (error) { return response(error instanceof PayloadTooLargeError ? 413 : 400, copy.malformed); }
  const result = contactSchema.safeParse(input);
  if (!result.success) return response(422, copy.validation);
  const config = getContactConfig();
  if (!config) return response(503, copy.unavailable);
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (!config.allowedHostnames.includes(new URL(origin).hostname)) return response(403, copy.malformed); }
    catch { return response(403, copy.malformed); }
  }
  try { if (!await verifyTurnstile(result.data.turnstileToken, config.secret, config.allowedHostnames)) return response(422, copy.spamError); }
  catch { return response(502, copy.error); }
  let submissionId: string | undefined;
  if (config.googleSheets) {
    try { submissionId = await saveContactToSheet(result.data, config.googleSheets); }
    catch (error) {
      console.error("Contact spreadsheet write was not confirmed");
      return error instanceof SheetsDeliveryError && error.rateLimited ? response(429, copy.rateLimited) : response(502, copy.error);
    }
  }
  try { await sendContactEmail(result.data, config); }
  catch (error) {
    if (!submissionId) return error instanceof EmailDeliveryError && error.rateLimited ? response(429, copy.rateLimited) : response(502, copy.error);
    // The request is already saved. An email error must not ask the visitor to
    // resubmit it. Log only the internal ID so staff can locate the sheet row.
    console.error("Contact saved to spreadsheet, but notification email failed", { submissionId });
  }
  return response(200, copy.success, true);
}
