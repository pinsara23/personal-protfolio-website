"use client";

import { useEffect, useState } from "react";
import profile from "@/data/profile.json";
import { getAllProjects } from "@/lib/projects";

export function TerminalOverlay() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === "`") setOpen((value) => !value); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  if (!open) return null;
  return <div className="terminal-overlay" role="dialog" aria-label="Portfolio terminal"><button className="terminal-close" onClick={() => setOpen(false)}>close [esc]</button><div><p>&gt; help</p><p className="terminal-muted">commands: projects · skills · contact · github</p><p>&gt; projects</p><p className="terminal-muted">{getAllProjects().map((project) => project.title).join(" / ")}</p><p>&gt; skills</p><p className="terminal-muted">{Object.keys(profile.skills).join(" / ")}</p><p>&gt; github</p><a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a><p className="terminal-caret">&gt; _</p></div></div>;
}
