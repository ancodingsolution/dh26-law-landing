import Link from "next/link";
import { company, navigation, site } from "@/lib/content";
import { Container } from "./container";

export function SiteFooter() {
  return <footer className="site-footer"><Container>
    <div className="footer-grid"><div><Link className="brand footer-brand" href="/"><span className="brand-name">{company.brandName}</span><span className="brand-tagline">{site.tagline}</span></Link><p className="legal-name">{company.legalName}</p><p className="footer-disclaimer">{site.disclaimer}</p></div>
      <div><h2>{site.footerNavigation}</h2><nav aria-label={site.footerNavigation}>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/chinh-sach-bao-mat">{site.privacyLabel}</Link></nav></div>
      <div><h2>{site.contactLabel}</h2><address><p>{company.contact.address}</p><a href={`tel:${company.contact.phoneE164}`}>{company.contact.phoneDisplay}</a><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></address><p className="registration-small">{site.registrationLabel}: {company.registration.number}</p></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {company.brandName}. {site.copyright}</span><Link href="/chinh-sach-bao-mat">{site.privacyLabel}</Link></div>
  </Container></footer>;
}
