import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return <article className="card">
    <div className="card-top"><span className="mono">{project.categories[0]}</span><span className="status">{project.status}</span></div>
    <h3>{project.title}</h3>
    <p>{project.shortDescription}</p>
    <div className="tags">{project.technologies.slice(0, 4).map((tech) => <span className="tag" key={tech}>{tech}</span>)}</div>
    <div className="card-footer"><Link className="text-link" href={`/projects/${project.slug}`}>View case study <ArrowUpRight size={14} /></Link>{project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}><Github size={16} /></a>}</div>
  </article>;
}
