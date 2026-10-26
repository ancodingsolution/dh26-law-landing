import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileCheck2, FileText, Gem, HeartHandshake, MessageSquareText, Scale, Settings2, ShieldCheck, UsersRound } from "lucide-react";
import { company, displayDate, homepage, site } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCards } from "@/components/services/service-cards";

const trustIcons = [UsersRound, ShieldCheck, FileText, HeartHandshake];
const valueIcons = [Gem, Scale, HeartHandshake];
const processIcons = [MessageSquareText, FileText, Settings2, FileCheck2];

export function HeroSection() {
  const brandWords = company.brandName.split(" ");
  return <section className="hero" aria-labelledby="hero-heading">
    <div className="hero-media" aria-hidden="true"><Image src={homepage.hero.image.src} alt={homepage.hero.image.alt} fill sizes="(max-width: 767px) 100vw, 76vw" loading="eager" fetchPriority="high" /></div>
    <Container className="hero-grid"><div className="hero-content"><p className="eyebrow">{homepage.hero.eyebrow}</p><h1 id="hero-heading"><span className="hero-brand">{brandWords.slice(0, -1).join(" ")} <span>{brandWords.at(-1)}</span></span><span className="hero-heading-copy">{homepage.hero.heading}</span></h1><p className="hero-description">{homepage.hero.description}</p><div className="hero-actions"><Link className={buttonVariants()} href="#lien-he">{site.primaryCta}<ArrowRight size={17} aria-hidden="true" /></Link><Link className={buttonVariants({ variant: "outline" })} href="#dich-vu">{site.secondaryCta}</Link></div></div></Container>
  </section>;
}
export function TrustStrip() {
  return <section className="trust-strip"><Container className="trust-grid">{homepage.trust.map((item, index) => { const Icon = trustIcons[index]; return <div className="trust-item" key={item.title}><Icon aria-hidden="true" size={30} strokeWidth={1.25} /><div><h2>{item.title}</h2><p>{item.text}</p></div></div>; })}</Container></section>;
}
export function ServicesSection() {
  return <section id="dich-vu" className="section" aria-labelledby="services-heading"><Container><div className="section-top"><SectionHeading {...homepage.services} id="services-heading" /><Link href="/dich-vu" className="text-link">{site.allServicesCta}<ArrowRight size={18} aria-hidden="true" /></Link></div><ServiceCards /></Container></section>;
}
export function AboutSection() {
  return <section id="gioi-thieu" className="section about-section" aria-labelledby="about-heading"><Container className="about-grid"><div className="about-art"><Image src={homepage.about.image.src} alt={homepage.about.image.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 40vw, 330px" loading="lazy" fetchPriority="low" /><span className="about-image-rule" aria-hidden="true" /></div><div><SectionHeading {...homepage.about} id="about-heading" /><p className="muted about-extra">{homepage.about.text}</p><dl className="registration-summary"><div><dt>{site.registrationLabel}</dt><dd>{company.registration.number}</dd></div><div><dt>{site.registrationDateLabel}</dt><dd>{displayDate(company.registration.date)}</dd></div></dl><Link href="/gioi-thieu" className={buttonVariants({ variant: "navy" })}>{site.detailsCta}<ArrowRight size={18} aria-hidden="true" /></Link></div></Container></section>;
}
export function ValuesSection() {
  return <section className="section values-section" aria-labelledby="values-heading"><Container><h2 id="values-heading">{homepage.valuesHeading}</h2><div className="values-grid">{homepage.values.map((item, index) => { const Icon = valueIcons[index]; return <article key={item.title}><span className="value-icon"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div></Container></section>;
}
export function ProcessSection() {
  return <section id="quy-trinh" className="section process-section" aria-labelledby="process-heading"><Container><SectionHeading {...homepage.process} id="process-heading" /><ol className="process-grid">{homepage.steps.map((step, index) => { const Icon = processIcons[index]; return <li key={step.title}><div className="process-symbol"><Icon size={25} strokeWidth={1.3} aria-hidden="true" /><span className="step-number" aria-hidden="true">0{index + 1}</span></div><div className="process-copy"><h3>{step.title}</h3><p>{step.text}</p></div></li>; })}</ol></Container></section>;
}
