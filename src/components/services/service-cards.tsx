import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Handshake, Scale } from "lucide-react";
import { services, site } from "@/lib/content";

const icons = { scale: Scale, book: BookOpen, handshake: Handshake, file: FileText };
export function ServiceCards() {
  return <div className="service-grid">{services.map((service, index) => {
    const Icon = icons[service.icon];
    return <article className="service-card" key={service.slug}><div className="service-card-top"><Icon aria-hidden="true" strokeWidth={1.25} size={32} /><span aria-hidden="true">0{index + 1}</span></div><h3><Link href={`/dich-vu/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><Link className="text-link" href={`/dich-vu/${service.slug}`} aria-label={`${site.detailsCta}: ${service.title}`}>{site.detailsCta}<ArrowUpRight size={18} aria-hidden="true" /></Link></article>;
  })}</div>;
}
