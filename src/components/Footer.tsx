import profile from "@/data/profile.json";
import { Github } from "lucide-react";

export function Footer() {
  return <footer className="site-footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
    <span>© {new Date().getFullYear()} {profile.name}. Built with care.</span>
    <a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
  </div></footer>;
}
