"use client";

import { useMemo, useState } from "react";
import { Project } from "@/types/project";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectFilters({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.title} ${project.shortDescription} ${project.technologies.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || project.categories.includes(category)) && (status === "All" || project.status === status);
  }), [projects, query, category, status]);
  return <><div className="filters">
    <input className="input" placeholder="Search projects or technologies…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search projects" />
    <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
    <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status"><option>All</option><option>Completed</option><option>In Progress</option><option>Experimental</option><option>Planned</option></select>
  </div><div className="count">{filtered.length} project{filtered.length === 1 ? "" : "s"} found</div><div className="grid">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div></>;
}
