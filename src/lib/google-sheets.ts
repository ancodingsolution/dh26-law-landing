import "server-only";
import { randomUUID } from "node:crypto";
import { JWT } from "google-auth-library";
import { z } from "zod";
import type { ContactPayload } from "@/schemas/contact.schema";

const configSchema = z.object({
  email: z.email(),
  privateKey: z.string().startsWith("-----BEGIN PRIVATE KEY-----\n").endsWith("-----END PRIVATE KEY-----"),
  spreadsheetId: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  sheetName: z.string().min(1).max(100),
});
type GoogleSheetsConfig = z.infer<typeof configSchema>;

// undefined: email-only mode; null: partially configured or invalid, fail closed.
export function getGoogleSheetsConfig(): GoogleSheetsConfig | null | undefined {
  const env = process.env;
  const values = [env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY, env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_SHEET_NAME];
  if (values.every((value) => !value?.trim())) return undefined;
  const result = configSchema.safeParse({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
    privateKey: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim(),
    spreadsheetId: env.GOOGLE_SPREADSHEET_ID?.trim(),
    sheetName: env.GOOGLE_SHEET_NAME?.trim() || "Contacts",
  });
  return result.success ? result.data : null;
}

export class SheetsDeliveryError extends Error {
  constructor(public readonly rateLimited = false) { super("Spreadsheet did not confirm the contact was saved"); }
}

export async function saveContactToSheet(input: ContactPayload, config: GoogleSheetsConfig) {
  // One shared deadline for authentication and append keeps the complete form
  // request within the existing browser/server timeouts, including email.
  const signal = AbortSignal.timeout(6_000);
  const auth = new JWT({
    email: config.email,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    transporterOptions: { signal, timeout: 6_000, retry: false },
  });
  const { token } = await auth.getAccessToken();
  if (!token) throw new SheetsDeliveryError();

  const submissionId = randomUUID();
  const range = `'${config.sheetName.replace(/'/g, "''")}'!A:H`;
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(range)}:append`);
  // RAW preserves leading zeroes in phone numbers and prevents submitted text
  // from being interpreted as spreadsheet formulas.
  url.searchParams.set("valueInputOption", "RAW");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ majorDimension: "ROWS", values: [[
      submissionId, new Date().toISOString(), input.name, input.phone,
      input.email, input.message, input.consent, "Mới",
    ]] }),
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new SheetsDeliveryError(response.status === 429);
  const result = z.object({ updates: z.object({ updatedRows: z.literal(1) }) }).safeParse(await response.json());
  if (!result.success) throw new SheetsDeliveryError();
  // Append is not automatically retried: a timeout could occur after Google
  // already wrote the row, so replaying it could create a duplicate.
  return submissionId;
}
