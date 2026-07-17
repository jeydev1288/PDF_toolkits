import type { MetadataRoute } from "next";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdftoolkit.kr";
  return ["/", ...tools.map((tool) => tool.route), "/about", "/privacy", "/terms", "/contact"].map((path) => ({ url: new URL(path, baseUrl).toString(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : path.startsWith("/tools/") ? 0.9 : 0.5 }));
}
