type Environment = Record<string, string | undefined>;
export function getSiteUrl(env: Environment = process.env) {
  const production = env.VERCEL_ENV === "production";
  if (production && !env.NEXT_PUBLIC_SITE_URL) throw new Error("NEXT_PUBLIC_SITE_URL is required for production");
  const url = new URL(env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("NEXT_PUBLIC_SITE_URL must be a plain HTTP(S) origin");
  if (production && (url.protocol !== "https:" || /(^localhost$|^127\.|\.example$|\.invalid$)/.test(url.hostname))) throw new Error("Production requires a real HTTPS canonical domain");
  return url;
}
export const siteUrl = getSiteUrl();
export const isIndexable = process.env.VERCEL_ENV === "production";
export function canonical(path = "/") { return new URL(path, siteUrl).toString(); }
