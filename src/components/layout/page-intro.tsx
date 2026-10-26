import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "./container";
export function PageIntro({ title, eyebrow, description, path, parent }: { title: string; eyebrow: string; description: string; path: string; parent?: { name: string; path: string } }) {
  const items = [{ name: site.homeLabel, path: "/" }, ...(parent ? [parent] : []), { name: title, path }];
  return <section className="page-intro"><Container><nav aria-label={site.breadcrumbLabel} className="breadcrumb"><ol>{items.map((item, i) => <li key={item.path}>{i > 0 && <ChevronRight size={12} aria-hidden="true" />}{i === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro-description">{description}</p></Container><JsonLd data={breadcrumbJsonLd(items)} /></section>;
}
