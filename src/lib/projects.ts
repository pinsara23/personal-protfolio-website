import rawProjects from "@/data/projects.json";
import { Project } from "@/types/project";

const projects = rawProjects as Project[];

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
  return projects.filter((project) => project.featured);
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
