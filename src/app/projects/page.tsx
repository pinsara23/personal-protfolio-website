import { ProjectFilters } from "@/components/ProjectFilters";
import { getAllProjects, getProjectCategories } from "@/lib/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <><section className="page-hero"><div className="container"><div className="eyebrow">Project registry</div><h1>Work, experiments, and systems.</h1><p className="lead">A JSON-driven catalogue of practical engineering work. Filter by area or status, then open a case study for the implementation details.</p></div></section><section id="projects" className="section"><div className="container"><ProjectFilters projects={getAllProjects()} categories={getProjectCategories()} /></div></section></>;
}
