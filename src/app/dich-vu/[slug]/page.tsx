import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, pages, serviceParams, services, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { serviceJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return serviceParams(); }
export async function generateMetadata({ params }: Props) {
  const service = getServiceBySlug((await params).slug);
  if (!service) notFound();
  return pageMetadata(service.seo.title, service.seo.description, `/dich-vu/${service.slug}`);
}
export default async function ServicePage({ params }: Props) {
  const service = getServiceBySlug((await params).slug);
  if (!service) notFound();
  return <><PageIntro title={service.title} description={service.summary} eyebrow={pages.services.eyebrow} path={`/dich-vu/${service.slug}`} parent={{ name: pages.services.title, path: "/dich-vu" }} /><Container className="section article-layout"><article className="prose">{service.body.map((block) => <section key={block.heading}><h2>{block.heading}</h2><p>{block.text}</p></section>)}<p className="review-note">{site.contentReviewNotice}</p><Link href="/lien-he" className={buttonVariants()}>{site.primaryCta}</Link></article><aside className="page-aside"><h2>{pages.services.relatedHeading}</h2><nav aria-label={pages.services.relatedHeading}>{services.filter((item) => item.slug !== service.slug).map((item) => <Link href={`/dich-vu/${item.slug}`} key={item.slug}>{item.title}</Link>)}</nav><a className="text-link" href="/lien-he">{site.primaryCta}</a></aside></Container><JsonLd data={serviceJsonLd(service)} /></>;
}
