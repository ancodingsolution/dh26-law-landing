import Link from "next/link";
import { company, displayDate, pages, services, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export const metadata = pageMetadata(pages.about.seo.title, pages.about.seo.description, "/gioi-thieu");
export default function AboutPage() {
  return <><PageIntro {...pages.about} path="/gioi-thieu" /><Container className="section article-layout"><article className="prose"><h2>{company.tradeName}</h2><p>{pages.about.intro}</p><h2>{pages.about.legalHeading}</h2><p className="company-full-name">{company.legalName}</p><dl className="legal-details"><div><dt>{site.registrationLabel}</dt><dd>{company.registration.number}</dd></div><div><dt>{site.registrationDateLabel}</dt><dd>{displayDate(company.registration.date)}</dd></div><div><dt>{site.registrationIssuerLabel}</dt><dd>{company.registration.issuedBy}</dd></div><div><dt>{site.addressLabel}</dt><dd>{company.contact.address}</dd></div></dl><h2>{pages.about.representativeHeading}</h2><h3>{company.representative.profession} {company.representative.name}</h3><p>{company.representative.role} · {company.representative.barAssociation}</p><dl className="legal-details"><div><dt>{site.lawyerCardLabel}</dt><dd>{company.representative.lawyerCardNumber}</dd></div><div><dt>{site.registrationDateLabel}</dt><dd>{displayDate(company.representative.lawyerCardIssuedDate)}</dd></div><div><dt>{site.registrationIssuerLabel}</dt><dd>{company.representative.lawyerCardIssuedBy}</dd></div></dl><h2>{pages.about.scopeHeading}</h2><ul>{services.map((service) => <li key={service.slug}><Link href={`/dich-vu/${service.slug}`}>{service.title}</Link></li>)}</ul></article><aside className="page-aside"><h2>{pages.services.ctaHeading}</h2><p>{pages.services.ctaDescription}</p><Link href="/lien-he" className={buttonVariants()}>{site.primaryCta}</Link></aside></Container></>;
}
