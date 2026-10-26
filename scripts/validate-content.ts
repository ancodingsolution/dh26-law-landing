import { existsSync, readdirSync, readFileSync } from "node:fs";
import { companySchema, siteSchema, homepageSchema, navigationSchema, pagesSchema, contactCopySchema, servicesSchema, validateReferences } from "../src/schemas/content.schema";
import { getSiteUrl } from "../src/lib/site-url";
if (!process.version.startsWith("v24.")) throw new Error("DH26 LAW requires Node.js 24.x");
const read = (file: string) => JSON.parse(readFileSync(new URL(`../src/data/${file}`, import.meta.url), "utf8"));
companySchema.parse(read("company.json"));
siteSchema.parse(read("site.json"));
pagesSchema.parse(read("pages.json"));
contactCopySchema.parse(read("contact.json"));
getSiteUrl();
const homepage = homepageSchema.parse(read("homepage.json"));
for (const image of [homepage.hero.image, homepage.about.image]) {
  if (!existsSync(new URL(`../public${image.src}`, import.meta.url))) throw new Error(`Missing homepage image: ${image.src}`);
}
const navigation = navigationSchema.parse(read("navigation.json"));
const files = readdirSync(new URL("../src/data/services/", import.meta.url)).filter((file) => file.endsWith(".json"));
const services = servicesSchema.parse(files.map((file) => read(`services/${file}`)));
for (const [i, file] of files.entries()) if (file !== `${services[i].slug}.json`) throw new Error(`Service filename / slug mismatch: ${file}`);
validateReferences(homepage.serviceSlugs, services.filter((service) => service.status === "published").map((service) => service.slug), navigation.map((item) => item.href));
console.log(`Content validated: company, site, homepage, navigation, ${services.length} services`);
