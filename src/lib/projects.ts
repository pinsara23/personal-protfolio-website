import rawProjects from "@/data/projects.json";
import { Project } from "@/types/project";

const projects = rawProjects as Project[];
const featuredOrder = ["mealbridge", "distributed-chat", "smart-paw", "friday", "adaptive-scheduler"];

const duplicateSlugs = projects.filter((project, index) =>
  projects.findIndex((candidate) => candidate.slug === project.slug) !== index
);
if (duplicateSlugs.length > 0) {
  throw new Error(`Duplicate project slugs: ${duplicateSlugs.map((project) => project.slug).join(", ")}`);
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  const featured = projects.filter((project) => project.featured);
  return featured.sort((a, b) => {
    const aIndex = featuredOrder.indexOf(a.id);
    const bIndex = featuredOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function searchProjects(query: string): Project[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return projects;
  return projects.filter((project) =>
    [project.title, project.shortDescription, project.description, ...project.technologies]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

export function getProjectCategories(): string[] {
  return [...new Set(projects.flatMap((project) => project.categories))].sort();
}

export function getProjectTechnologies(): string[] {
  return [...new Set(projects.flatMap((project) => project.technologies))].sort();
}
