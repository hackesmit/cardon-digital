import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/cases";

const base = "https://cardondigital.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/work", "/services", "/about", "/contact"];
  const pages: MetadataRoute.Sitemap = [];

  for (const path of statics) {
    pages.push({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 });
    pages.push({ url: `${base}/es${path}`, changeFrequency: "monthly", priority: path === "" ? 0.9 : 0.6 });
  }
  for (const c of caseStudies) {
    pages.push({ url: `${base}/work/${c.slug}`, changeFrequency: "monthly", priority: 0.6 });
    pages.push({ url: `${base}/es/work/${c.slug}`, changeFrequency: "monthly", priority: 0.5 });
  }
  return pages;
}
