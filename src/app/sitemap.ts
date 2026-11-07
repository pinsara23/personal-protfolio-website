import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://pinsara.dev"; return ["/", "/projects", "/about", "/skills", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })).concat(getAllProjects().map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date() }))); }
