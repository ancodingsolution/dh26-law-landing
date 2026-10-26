// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
const { sendMock, tokenMock } = vi.hoisted(() => ({ sendMock: vi.fn(), tokenMock: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: sendMock }; } }));
vi.mock("google-auth-library", () => ({ JWT: class { getAccessToken = tokenMock; } }));
import { POST } from "@/app/api/contact/route";
import { contactEmail } from "@/lib/email";
import { contactSchema } from "@/schemas/contact.schema";

const payload = { name: "Khách kiểm thử", phone: "0973787969", email: "client@example.org", message: "Tôi cần trao đổi về một vấn đề pháp lý.", consent: true, turnstileToken: "unit-test-token", website: "" };
const request = (body: unknown = payload, headers = {}) => new Request("https://law.example.org/api/contact", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const verification = (patch = {}) => ({ success: true, hostname: "law.example.org", action: "contact", ...patch });
beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "unit-test-key"); vi.stubEnv("CONTACT_SENDER_EMAIL", "sender@example.org");
  vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "recipient@example.org"); vi.stubEnv("TURNSTILE_SECRET_KEY", "unit-test-secret");
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "unit-test-site-key"); vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://law.example.org");
  vi.stubEnv("VERCEL_ENV", "production"); vi.stubEnv("CONTACT_WAF_CONFIGURED", "true");
  for (const name of ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SPREADSHEET_ID", "GOOGLE_SHEET_NAME"]) vi.stubEnv(name, "");
  tokenMock.mockReset().mockResolvedValue({ token: "unit-test-google-token" });
  sendMock.mockReset().mockResolvedValue({ data: { id: "unit-test-message-id" }, error: null });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(verification())));
});

describe("contact API with Google Sheets storage", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "form@test-project.iam.gserviceaccount.com");
    vi.stubEnv("GOOGLE_PRIVATE_KEY", "-----BEGIN PRIVATE KEY-----\\nunit-test-key\\n-----END PRIVATE KEY-----\\n");
    vi.stubEnv("GOOGLE_SPREADSHEET_ID", "unit-test-spreadsheet-id");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(fetch).mockReset()
      .mockResolvedValueOnce(Response.json(verification()))
      .mockResolvedValueOnce(Response.json({ updates: { updatedRows: 1 } }));
  });
  afterEach(() => { vi.restoreAllMocks(); });

  test("stores the contact after verification and before sending email", async () => {
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect((await result.json()).success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain("turnstile");
    expect(String(vi.mocked(fetch).mock.calls[1][0])).toContain("sheets.googleapis.com");
    expect(sendMock).toHaveBeenCalledOnce();
    expect(vi.mocked(fetch).mock.invocationCallOrder[1]).toBeLessThan(sendMock.mock.invocationCallOrder[0]);
  });
  test.each(["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SPREADSHEET_ID"])("missing %s disables submission without calling providers", async (name) => {
    vi.stubEnv(name, "");
    const result = await POST(request());
    expect(result.status).toBe(503);
    expect((await result.json()).success).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });
  test("invalid spam verification never authenticates with Google or writes a row", async () => {
    vi.mocked(fetch).mockReset().mockResolvedValueOnce(Response.json(verification({ success: false })));
    expect((await POST(request())).status).toBe(422);
    expect(fetch).toHaveBeenCalledOnce();
    expect(tokenMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });
  test.each([403, 429, 500])("Google status %s does not claim success or send email", async (status) => {
    vi.mocked(fetch).mockReset()
      .mockResolvedValueOnce(Response.json(verification()))
      .mockResolvedValueOnce(new Response(null, { status }));
    const result = await POST(request());
    expect(result.status).toBe(status === 429 ? 429 : 502);
    expect((await result.json()).success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(2);
    if (status === 429) expect(result.headers.get("retry-after")).toBe("60");
  });
  test("Google authentication failure does not send email", async () => {
    tokenMock.mockRejectedValueOnce(new Error("credentials rejected"));
    expect((await POST(request())).status).toBe(502);
    expect(fetch).toHaveBeenCalledOnce();
    expect(sendMock).not.toHaveBeenCalled();
  });
  test("ambiguous append network failure is not retried", async () => {
    vi.mocked(fetch).mockReset()
      .mockResolvedValueOnce(Response.json(verification()))
      .mockRejectedValueOnce(new Error("timeout"));
    expect((await POST(request())).status).toBe(502);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(sendMock).not.toHaveBeenCalled();
  });
  test.each([{}, { updates: { updatedRows: 0 } }])("unconfirmed append %j does not claim success", async (body) => {
    vi.mocked(fetch).mockReset()
      .mockResolvedValueOnce(Response.json(verification()))
      .mockResolvedValueOnce(Response.json(body));
    expect((await POST(request())).status).toBe(502);
    expect(sendMock).not.toHaveBeenCalled();
  });
  test.each([false, true])("email failure (rate limited: %s) after saved row still reports receipt", async (rateLimited) => {
    sendMock.mockResolvedValueOnce({ data: null, error: { name: rateLimited ? "rate_limit_exceeded" : "validation_error" } });
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect((await result.json()).success).toBe(true);
    expect(console.error).toHaveBeenCalledWith(
      "Contact saved to spreadsheet, but notification email failed", { submissionId: expect.any(String) },
    );
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(payload.email);
  });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("contact API never claims delivery without acceptance", () => {
  test("provider success returns fixed contract and proper sender/replyTo", async () => {
    const result = await POST(request());
    expect(result.status).toBe(200); expect((await result.json()).success).toBe(true);
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ from: "sender@example.org", to: "recipient@example.org", replyTo: payload.email }), expect.anything());
    expect(result.headers.get("cache-control")).toBe("no-store");
  });
  test.each(["RESEND_API_KEY", "CONTACT_SENDER_EMAIL", "TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "CONTACT_WAF_CONFIGURED"])("missing %s fails closed", async (name) => {
    vi.stubEnv(name, "");
    const result = await POST(request());
    expect(result.status).toBe(503); expect((await result.json()).success).toBe(false); expect(sendMock).not.toHaveBeenCalled();
  });
  test.each([{ success: false }, { hostname: "attacker.example.org" }, { action: "different-form" }])("invalid Turnstile %j cannot send", async (patch) => {
    vi.mocked(fetch).mockResolvedValue(Response.json(verification(patch)));
    const result = await POST(request());
    expect(result.status).toBe(422); expect(sendMock).not.toHaveBeenCalled();
  });
  test("empty token cannot send", async () => { expect((await POST(request({ ...payload, turnstileToken: "" }))).status).toBe(422); expect(sendMock).not.toHaveBeenCalled(); });
  test("verification network failure is not success", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    const result = await POST(request()); expect(result.status).toBe(502); expect(sendMock).not.toHaveBeenCalled();
  });
  test.each([{ data: null, error: { name: "validation_error" } }, { data: {}, error: null }])("provider rejection or missing ID fails", async (providerResult) => {
    sendMock.mockResolvedValue(providerResult);
    const result = await POST(request()); expect(result.status).toBe(502); expect((await result.json()).success).toBe(false);
  });
  test("upstream rate limit returns 429 with retry header", async () => {
    sendMock.mockResolvedValue({ data: null, error: { name: "rate_limit_exceeded" } });
    const result = await POST(request()); expect(result.status).toBe(429); expect(result.headers.get("retry-after")).toBe("60");
  });
  test("malformed, wrong content type, invalid values and oversized body fail before network", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    expect((await POST(request(payload, { "Content-Type": "text/plain" }))).status).toBe(400);
    expect((await POST(request({ ...payload, consent: false }))).status).toBe(422);
    expect((await POST(request({ ...payload, message: "a".repeat(17_000) }))).status).toBe(413);
    expect(sendMock).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
  });
  test("cross-site origin is rejected", async () => { expect((await POST(request(payload, { Origin: "https://attacker.example.org" }))).status).toBe(403); expect(sendMock).not.toHaveBeenCalled(); });
  test("email HTML escapes supplied markup, text part preserves readable content", () => {
    const email = contactEmail(contactSchema.parse({ ...payload, message: '<script>alert("XSS")</script> & message' }));
    expect(email.html).not.toContain("<script>"); expect(email.html).toContain("&lt;script&gt;"); expect(email.text).toContain("<script>");
  });
});
