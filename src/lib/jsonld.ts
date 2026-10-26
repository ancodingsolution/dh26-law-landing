import { company } from "@/lib/content";
import { canonical } from "./site-url";
import type { Service } from "@/schemas/content.schema";
export function organizationJsonLd() {
  return { "@context": "https://schema.org", "@type": "LegalService", "@id": canonical("/#organization"), name: company.tradeName, legalName: company.legalName, url: canonical(), telephone: company.contact.phoneE164, email: company.contact.email, address: { "@type": "PostalAddress", streetAddress: company.contact.address, addressLocality: company.contact.locality, addressCountry: company.contact.countryCode } };
}
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonical(item.path) })) };
}
export function serviceJsonLd(service: Service) {
  return { "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.summary, serviceType: service.title, url: canonical(`/dich-vu/${service.slug}`), provider: { "@id": canonical("/#organization") } };
}
export function serializeJsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, "\\u003c"); }
