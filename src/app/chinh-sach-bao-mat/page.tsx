import { pages } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/layout/container";
import { ContactDetails } from "@/components/contact/contact-section";
export const metadata = pageMetadata(pages.privacy.seo.title, pages.privacy.seo.description, "/chinh-sach-bao-mat");
export default function PrivacyPage() { return <><PageIntro {...pages.privacy} path="/chinh-sach-bao-mat" /><Container className="section"><article className="prose privacy-prose"><p className="draft-notice">{pages.privacy.draftNotice}</p>{pages.privacy.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<ContactDetails /></article></Container></>; }
