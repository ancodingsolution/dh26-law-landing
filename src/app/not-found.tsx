import Link from "next/link";
import { pages, site } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() { return <div className="container section not-found"><p className="eyebrow">{pages.notFound.code}</p><h1>{pages.notFound.title}</h1><p>{pages.notFound.description}</p><Link href="/" className={buttonVariants()}>{site.backHome}</Link></div>; }
