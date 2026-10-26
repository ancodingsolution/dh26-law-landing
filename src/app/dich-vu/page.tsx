import { pages, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/layout/container";
import { ServiceCards } from "@/components/services/service-cards";

export const metadata = pageMetadata(pages.services.seo.title, pages.services.seo.description, "/dich-vu");
export default function ServicesPage() { return <><PageIntro {...pages.services} path="/dich-vu" /><Container className="section"><ServiceCards /><p className="review-note">{site.contentReviewNotice}</p></Container></>; }
