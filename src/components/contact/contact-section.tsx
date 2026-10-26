import { Mail, MapPin, Phone } from "lucide-react";
import { company, homepage, site } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { ContactForm } from "./contact-form";

export function ContactDetails() {
  return <address className="contact-details"><div><Phone aria-hidden="true" size={21} /><div><span>{site.phoneLabel}</span><a className="contact-phone" href={`tel:${company.contact.phoneE164}`}>{company.contact.phoneDisplay}</a></div></div><div><Mail aria-hidden="true" size={21} /><div><span>{site.emailLabel}</span><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></div></div><div><MapPin aria-hidden="true" size={21} /><div><span>{site.addressLabel}</span><p>{company.contact.address}</p></div></div></address>;
}
export function ContactSection({ heading = true, variant = "section" }: { heading?: boolean; variant?: "section" | "sidebar" }) {
  if (variant === "sidebar") return <section id="lien-he" className="home-contact" aria-labelledby="contact-heading"><div className="contact-card"><p className="eyebrow">{homepage.contact.eyebrow}</p><h2 id="contact-heading">{homepage.contact.cardHeading}</h2><p className="contact-card-description">{homepage.contact.description}</p><ContactForm compact /><p className="contact-divider">{homepage.contact.directLabel}</p><ContactDetails /></div></section>;
  return <section id="lien-he" className="section contact-section" aria-labelledby={heading ? "contact-heading" : undefined}><Container className="contact-grid"><div>{heading && <SectionHeading {...homepage.contact} id="contact-heading" />}<ContactDetails /></div><ContactForm /></Container></section>;
}
