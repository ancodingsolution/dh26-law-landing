import { pages } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/page-intro";
import { ContactSection } from "@/components/contact/contact-section";
export const metadata = pageMetadata(pages.contact.seo.title, pages.contact.seo.description, "/lien-he");
export default function ContactPage() { return <><PageIntro {...pages.contact} path="/lien-he" /><ContactSection heading={false} /></>; }
