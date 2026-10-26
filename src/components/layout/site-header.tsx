import Link from "next/link";
import { Phone } from "lucide-react";
import { company, navigation, site } from "@/lib/content";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return <header className="site-header"><Container className="header-inner">
    <Link href="/" className="brand"><span className="brand-name">{company.brandName}</span><span className="brand-tagline">{site.tagline}</span></Link>
    <nav className="desktop-nav" aria-label={site.navigationLabel}>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
    <a className="header-phone" href={`tel:${company.contact.phoneE164}`}><Phone size={17} aria-hidden="true" /><span>{company.contact.phoneDisplay}</span></a>
    <MobileNav items={navigation} openLabel={site.mobileMenuOpen} closeLabel={site.mobileMenuClose} navigationLabel={site.navigationLabel} />
  </Container></header>;
}
