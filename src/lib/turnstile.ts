import "server-only";
export async function verifyTurnstile(token: string, secret: string, allowedHostnames: string[]) {
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token }), cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Verification provider unavailable");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object") return false;
  const { success, hostname, action } = result as Record<string, unknown>;
  return success === true && typeof hostname === "string" && allowedHostnames.includes(hostname) && action === "contact";
}
