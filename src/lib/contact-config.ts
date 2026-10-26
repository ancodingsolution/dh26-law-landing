import "server-only";
import { z } from "zod";
import company from "@/data/company.json";
import { getSiteUrl } from "./site-url";
import { getGoogleSheetsConfig } from "./google-sheets";
export function getContactConfig() {
  const env = process.env;
  const key = env.RESEND_API_KEY?.trim();
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const sender = env.CONTACT_SENDER_EMAIL?.trim();
  const recipient = env.CONTACT_RECIPIENT_EMAIL?.trim() || company.contact.email;
  const googleSheets = getGoogleSheetsConfig();
  if (googleSheets === null) return null;
  if (!key || !secret || !siteKey || !sender || !z.email().safeParse(sender).success || !z.email().safeParse(recipient).success) return null;
  if (env.VERCEL_ENV === "production" && env.CONTACT_WAF_CONFIGURED !== "true") return null;
  const site = getSiteUrl();
  const allowedHostnames = [site.hostname, ...(env.TURNSTILE_ALLOWED_HOSTNAMES || "").split(",").map((host) => host.trim()).filter(Boolean)];
  return { key, secret, sender, recipient, allowedHostnames, googleSheets };
}
export type ContactConfig = NonNullable<ReturnType<typeof getContactConfig>>;
