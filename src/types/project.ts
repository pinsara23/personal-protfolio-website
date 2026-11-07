export type ProjectStatus = "Completed" | "In Progress" | "Experimental" | "Planned";

export interface ProjectMetric {
  label: string;
  value: string;
  note?: string;
}

export interface ProjectPhase {
  name: string;
  status: ProjectStatus;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categories: string[];
  technologies: string[];
  status: ProjectStatus;
  featured: boolean;
  github?: string;
  demoUrl?: string;
  overview: string;
  problem?: string;
  objectives?: string[];
  architecture?: string;
  implementation?: string[];
  contribution?: string;
  challenges?: string[];
  results?: string;
  metrics?: ProjectMetric[];
  futureImprovements?: string[];
  images?: string[];
  videos?: string[];
  deployment?: string;
  developmentPhases?: ProjectPhase[];
}
