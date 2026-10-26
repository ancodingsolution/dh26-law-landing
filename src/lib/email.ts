import "server-only";
import { Resend } from "resend";
import copy from "@/data/contact.json";
import type { ContactPayload } from "@/schemas/contact.schema";
import type { ContactConfig } from "./contact-config";
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!); }
export function contactEmail(input: ContactPayload) {
  const rows = [[copy.name, input.name], [copy.phone, input.phone], [copy.email, input.email], [copy.message, input.message]];
  return { subject: copy.subject, text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"), html: `<h1>${escapeHtml(copy.subject)}</h1>${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br/>${escapeHtml(value).replace(/\n/g, "<br/>")}</p>`).join("")}` };
}
export class EmailDeliveryError extends Error {
  constructor(public readonly rateLimited = false) { super("Email provider did not accept the message"); }
}
export async function sendContactEmail(input: ContactPayload, config: ContactConfig) {
  const resend = new Resend(config.key);
  const { data, error } = await resend.emails.send({ from: config.sender, to: config.recipient, replyTo: input.email, ...contactEmail(input) }, { signal: AbortSignal.timeout(10_000) });
  if (error || !data?.id) throw new EmailDeliveryError(error?.name === "rate_limit_exceeded");
}
