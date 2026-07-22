import type { MetadataRoute } from "next";

const base = "https://cardondigital.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/work/monte-xanic", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/work/enkanto", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/industries/winery", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/industries/construction", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/industries/hiring", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/industries/restaurants", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/industries/clinics", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  ];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
