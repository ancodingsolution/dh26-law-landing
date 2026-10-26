// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
const { tokenMock, jwtMock } = vi.hoisted(() => ({ tokenMock: vi.fn(), jwtMock: vi.fn() }));
vi.mock("google-auth-library", () => ({ JWT: class {
  constructor(options: unknown) { jwtMock(options); }
  getAccessToken = tokenMock;
} }));
import { getGoogleSheetsConfig, saveContactToSheet } from "@/lib/google-sheets";
import { contactSchema } from "@/schemas/contact.schema";

beforeEach(() => {
  vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "form@test-project.iam.gserviceaccount.com");
  vi.stubEnv("GOOGLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\\nunit-test-key\\n-----END PRIVATE KEY-----\\n");
  vi.stubEnv("GOOGLE_SPREADSHEET_ID", "unit-test-sheet");
  vi.stubEnv("GOOGLE_SHEET_NAME", "Contacts");
  tokenMock.mockReset().mockResolvedValue({ token: "unit-test-access-token" });
  jwtMock.mockReset();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ updates: { updatedRows: 1 } })));
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("Google Sheets configuration and row format", () => {
  test("normalizes escaped newlines and accepts actual PEM newlines", () => {
    const escaped = getGoogleSheetsConfig();
    expect(escaped?.privateKey).toBe("-----BEGIN PRIVATE KEY-----\nunit-test-key\n-----END PRIVATE KEY-----");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", escaped!.privateKey);
    expect(getGoogleSheetsConfig()).toEqual(escaped);
  });
  test.each([
    ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "invalid"],
    ["GOOGLE_PRIVATE_KEY", "not-a-key"],
    ["GOOGLE_SPREADSHEET_ID", "https://docs.google.com/spreadsheets/d/id/edit"],
  ])("rejects malformed %s", (name, value) => {
    vi.stubEnv(name, value);
    expect(getGoogleSheetsConfig()).toBeNull();
  });
  test("absent Google configuration preserves email-only mode", () => {
    for (const name of ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SPREADSHEET_ID", "GOOGLE_SHEET_NAME"]) vi.stubEnv(name, "");
    expect(getGoogleSheetsConfig()).toBeUndefined();
    vi.stubEnv("GOOGLE_SHEET_NAME", "Contacts");
    expect(getGoogleSheetsConfig()).toBeNull();
  });
  test("tab defaults to Contacts when credentials are present", () => {
    vi.stubEnv("GOOGLE_SHEET_NAME", "");
    expect(getGoogleSheetsConfig()?.sheetName).toBe("Contacts");
  });
  test("uses RAW text, normalized phone, correct columns, and an escaped tab name", async () => {
    vi.stubEnv("GOOGLE_SHEET_NAME", "Khách 'mới'");
    const input = contactSchema.parse({
      name: "=1+1", phone: "0973 787 969", email: "client@example.org",
      message: '=HYPERLINK("https://example.org", "formula-looking text")',
      consent: true, turnstileToken: "must-not-be-stored", website: "",
    });
    const id = await saveContactToSheet(input, getGoogleSheetsConfig()!);
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    expect(decodeURIComponent(String(url))).toContain("'Khách ''mới'''!A:H:append");
    expect(new URL(String(url)).searchParams.get("valueInputOption")).toBe("RAW");
    expect(new URL(String(url)).searchParams.get("insertDataOption")).toBe("INSERT_ROWS");
    expect(options).toMatchObject({ method: "POST", cache: "no-store", headers: { Authorization: "Bearer unit-test-access-token" } });
    const body = JSON.parse(String(options?.body));
    expect(body).toEqual({ majorDimension: "ROWS", values: [[id, expect.any(String), "=1+1", "0973787969", input.email, input.message, true, "Mới"]] });
    expect(new Date(body.values[0][1]).toISOString()).toBe(body.values[0][1]);
    expect(JSON.stringify(body)).not.toContain(input.turnstileToken);
    expect(jwtMock).toHaveBeenCalledWith(expect.objectContaining({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      transporterOptions: expect.objectContaining({ retry: false, signal: options?.signal }),
    }));
  });
});
