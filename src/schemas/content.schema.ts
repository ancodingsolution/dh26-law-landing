import { z } from "zod";

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
export const seoSchema = z.object({ title: text.max(110), description: text.max(300) });
export const companySchema = z.object({
  legalName: text, tradeName: text, brandName: text,
  contact: z.object({ phoneDisplay: text, phoneE164: z.string().regex(/^\+84\d{9,10}$/), email: z.email(), address: text, locality: text, countryCode: z.string().length(2) }),
  representative: z.object({ name: text, role: text, profession: text, lawyerCardNumber: text, lawyerCardIssuedDate: isoDate, lawyerCardIssuedBy: text, barAssociation: text }),
  registration: z.object({ number: text, date: isoDate, issuedBy: text }),
});
export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: text,
  icon: z.enum(["scale", "book", "handshake", "file"]), summary: text,
  body: z.array(z.object({ heading: text, text })).min(1),
  seo: seoSchema, status: z.enum(["draft", "published"]),
});
export const servicesSchema = z.array(serviceSchema).superRefine((services, ctx) => {
  const seen = new Set<string>();
  services.forEach((service, index) => {
    if (seen.has(service.slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: `Duplicate service slug: ${service.slug}` });
    seen.add(service.slug);
  });
});
export const navigationSchema = z.array(z.object({ label: text, href: z.string().regex(/^\/(?!\/)/) })).min(1);
const section = z.object({ eyebrow: text, heading: text, description: text });
const item = z.object({ title: text, text });
const illustration = z.object({ src: z.string().regex(/^\/images\/[a-z0-9-]+\.(webp|png|jpg)$/), alt: z.string() });
export const homepageSchema = z.object({
  hero: z.object({ eyebrow: text, heading: text, description: text, visualCaption: text, image: illustration }),
  trust: z.array(item).length(4), services: section, serviceSlugs: z.array(text).length(4),
  about: section.extend({ text, visualCaption: text, image: illustration }), valuesHeading: text, values: z.array(item).length(3),
  process: section, steps: z.array(item).length(4), contact: section.extend({ cardHeading: text, directLabel: text }),
});
export const siteSchema = z.object({
  locale: text, title: text, description: text, tagline: text,
  primaryCta: text, secondaryCta: text, detailsCta: text, allServicesCta: text, backHome: text,
  skipLink: text, navigationLabel: text, mobileMenuOpen: text, mobileMenuClose: text,
  footerNavigation: text, contactLabel: text, phoneLabel: text, emailLabel: text, addressLabel: text,
  privacyLabel: text, copyright: text, disclaimer: text, breadcrumbLabel: text, homeLabel: text,
  registrationLabel: text, registrationDateLabel: text, registrationIssuerLabel: text,
  representativeLabel: text, lawyerCardLabel: text, barLabel: text, contentReviewNotice: text,
});
const contentPage = z.object({ title: text, eyebrow: text, description: text, seo: seoSchema });
export const pagesSchema = z.object({
  about: contentPage.extend({ legalHeading: text, representativeHeading: text, scopeHeading: text, intro: text }),
  services: contentPage.extend({ relatedHeading: text, ctaHeading: text, ctaDescription: text }),
  contact: contentPage,
  privacy: contentPage.extend({ draftNotice: text, sections: z.array(z.object({ heading: text, text })).min(1) }),
  notFound: z.object({ title: text, description: text, code: text }),
});
export const contactCopySchema = z.object({
  name: text, phone: text, email: text, message: text,
  namePlaceholder: text, phonePlaceholder: text, emailPlaceholder: text, messagePlaceholder: text,
  consent: text, privacyLink: text, consentSuffix: text,
  submit: text, submitting: text, success: text, error: text, unavailable: text,
  notice: text, requiredNote: text, spamError: text, nameError: text, phoneError: text,
  emailError: text, messageError: text, consentError: text, verificationLabel: text,
  malformed: text, validation: text, rateLimited: text, subject: text,
});
export function validateReferences(slugs: string[], publishedSlugs: string[], hrefs: string[]) {
  if (new Set(slugs).size !== slugs.length) throw new Error("Duplicate homepage service reference");
  for (const slug of slugs) if (!publishedSlugs.includes(slug)) throw new Error(`Broken service reference: ${slug}`);
  const routes = new Set(["/", "/gioi-thieu", "/dich-vu", "/lien-he", "/chinh-sach-bao-mat", "/#quy-trinh", ...publishedSlugs.map((slug) => `/dich-vu/${slug}`)]);
  for (const href of hrefs) if (!routes.has(href)) throw new Error(`Broken navigation reference: ${href}`);
}
export type Service = z.infer<typeof serviceSchema>;
