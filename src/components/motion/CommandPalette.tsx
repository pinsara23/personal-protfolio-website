"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProjects } from "@/lib/projects";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const projects = getAllProjects();
  const results = projects.filter((project) => `${project.title} ${project.technologies.join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return <>{<button className="command-trigger" onClick={() => setOpen(true)} aria-label="Open command palette"><Search size={14} /><span>Jump to</span><kbd>⌘ K</kbd></button>}{open && <div className="palette-backdrop" onClick={() => setOpen(false)}><div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(event) => event.stopPropagation()}><div className="palette-input"><Search size={17}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects…" /><button onClick={() => setOpen(false)} aria-label="Close"><X size={17}/></button></div><div className="palette-links"><Link href="/" onClick={() => setOpen(false)}>Home</Link><Link href="/projects" onClick={() => setOpen(false)}>All projects</Link>{results.map((project) => <Link key={project.id} href={`/projects/${project.slug}`} onClick={() => setOpen(false)}><span>{project.title}</span><small>{project.status}</small></Link>)}</div></div></div>}</>;
}
