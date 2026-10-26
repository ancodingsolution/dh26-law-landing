import companyData from "@/data/company.json";
import siteData from "@/data/site.json";
import homepageData from "@/data/homepage.json";
import navigationData from "@/data/navigation.json";
import pagesData from "@/data/pages.json";
import litigation from "@/data/services/tham-gia-to-tung.json";
import consulting from "@/data/services/tu-van-phap-luat.json";
import representation from "@/data/services/dai-dien-ngoai-to-tung.json";
import other from "@/data/services/dich-vu-phap-ly-khac.json";
import { companySchema, siteSchema, homepageSchema, navigationSchema, pagesSchema, servicesSchema, validateReferences } from "@/schemas/content.schema";

export const company = companySchema.parse(companyData);
export const site = siteSchema.parse(siteData);
export const homepage = homepageSchema.parse(homepageData);
export const navigation = navigationSchema.parse(navigationData);
export const pages = pagesSchema.parse(pagesData);
const allServices = servicesSchema.parse([litigation, consulting, representation, other]);
export const services = allServices.filter((service) => service.status === "published");
validateReferences(homepage.serviceSlugs, services.map((service) => service.slug), navigation.map((item) => item.href));
export function getServiceBySlug(slug: string) { return services.find((service) => service.slug === slug); }
export function serviceParams() { return services.map(({ slug }) => ({ slug })); }
export function displayDate(iso: string) { return new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`)); }
