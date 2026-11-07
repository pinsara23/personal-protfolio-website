import { notFound } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export function generateStaticParams() { return getAllProjects().map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: { slug: string } }) { const project = getProjectBySlug(params.slug); return { title: project?.title ?? "Project" }; }

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();
  const listSection = (title: string, items?: string[]) => items?.length ? <section className="detail-section"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section> : null;
  return <><section className="detail-header"><div className="container"><div className="eyebrow">{project.categories.join(" / ")}</div><h1>{project.title}</h1><p className="lead">{project.description}</p><div className="actions">{project.github && <a className="button" href={project.github} target="_blank" rel="noreferrer"><Github size={16}/> View repository</a>}{project.demoUrl && <a className="button primary" href={project.demoUrl}><ExternalLink size={16}/> Watch it live</a>}<span className="button" style={{color:"var(--accent)"}}>{project.status}</span></div></div></section>
    <div className="container detail-layout"><article>
      <section className="detail-section"><h2>Overview</h2><p className="prose">{project.overview}</p></section>
      {project.problem && <section className="detail-section"><h2>Problem</h2><p className="prose">{project.problem}</p></section>}
      {listSection("Objectives", project.objectives)}
      {project.architecture && <section className="detail-section"><h2>Architecture</h2><p className="prose">{project.architecture}</p></section>}
      {listSection("Implementation", project.implementation)}
      {project.contribution && <section className="detail-section"><h2>Contribution</h2><p className="prose">{project.contribution}</p></section>}
      {project.developmentPhases && <section className="detail-section"><h2>Development timeline</h2><div className="timeline">{project.developmentPhases.map((phase) => <div className={`phase ${phase.status === "Completed" ? "completed" : phase.status === "In Progress" ? "progress" : "planned"}`} key={phase.name}><div className="phase-head"><strong>{phase.name}</strong><span className="status">{phase.status}</span></div><p>{phase.description}</p></div>)}</div></section>}
      {listSection("Future improvements", project.futureImprovements)}
    </article><aside className="sidebar"><div className="side-block"><h3>Technology</h3><div className="tags">{project.technologies.map((tech) => <span className="tag" key={tech}>{tech}</span>)}</div></div>{project.metrics && <div className="side-block"><h3>Verified details</h3><div className="metrics">{project.metrics.map((metric) => <div className="metric" key={metric.label}><strong>{metric.value}</strong><small>{metric.label}{metric.note ? ` · ${metric.note}` : ""}</small></div>)}</div></div>}<div className="side-block"><h3>Accuracy note</h3><p className="prose" style={{fontSize:".82rem"}}>This page only presents metrics and implementation details recorded in the project registry. Planned or unverified capabilities are labeled rather than inferred.</p></div></aside></div></>;
}
