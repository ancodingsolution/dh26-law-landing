import { AboutSection, HeroSection, ProcessSection, ServicesSection, TrustStrip, ValuesSection } from "@/components/home/sections";
import { ContactSection } from "@/components/contact/contact-section";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/container";
export const metadata = pageMetadata(site.title, site.description, "/");
export default function Home() { return <div className="home-page"><HeroSection /><TrustStrip /><Container className="home-layout"><div className="home-primary"><ServicesSection /><AboutSection /><ValuesSection /><ProcessSection /></div><ContactSection variant="sidebar" /></Container></div>; }
