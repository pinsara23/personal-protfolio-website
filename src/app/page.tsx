import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import profile from "@/data/profile.json";
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ParticleField } from "@/components/motion/ParticleField";
import { RotatingRole } from "@/components/motion/RotatingRole";

export default function Home() {
  const featured = getFeaturedProjects();
  return <>
    <section id="hero" className="hero hero-living"><ParticleField /><div className="hero-grid" /><div className="container hero-content">
      <div className="eyebrow">01 / Computer Engineering / Sri Lanka</div>
      <h1 className="hero-title">Building systems that turn ambitious ideas into <em>working software.</em></h1>
      <div className="hero-role">Currently exploring <RotatingRole /> systems<span className="blink">_</span></div>
      <p className="lead">{profile.introduction}</p>
      <div className="actions"><a className="button primary" href={profile.cv}><Download size={16}/> Download CV</a><Link className="button" href="/projects">Explore projects <ArrowRight size={16}/></Link></div>
      <div className="actions" style={{marginTop:20}}><a className="text-link" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>{profile.linkedin && <a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}{profile.email && <a className="text-link" href={`mailto:${profile.email}`}><Mail size={16}/> Email</a>}</div>
    </div></section>
    <section className="section section-blueprint"><div className="container"><div className="section-label">02 / Selected work</div><div className="section-head"><div><h2>Projects with a point of view.</h2></div><p>From embedded hardware to distributed services, each project documents what is built, what is still in progress, and what is deliberately not claimed.</p></div><div className="featured-grid">{featured.map((project, index) => <div className={index === 0 ? "featured-large" : ""} key={project.id}><ProjectCard project={project}/></div>)}</div></div></section>
    <section id="about" className="section"><div className="container"><div className="section-label">03 / About snapshot</div><div className="bento-grid"><div className="bento-card bento-wide"><span className="mono">Academic base</span><h3>{profile.university}</h3><p>{profile.degree}</p></div><div className="bento-card"><span className="mono">Minor</span><strong>High Performance<br/>Computing</strong></div><div className="bento-card bento-accent"><span className="mono">Currently building</span><strong>Distributed Chat<br/>/ Phase 4</strong></div><div className="bento-card bento-wide"><span className="mono">Interests / 08</span><div className="interest-grid">{profile.interests.slice(0, 6).map((interest) => <div className="interest" key={interest}>{interest}</div>)}</div></div></div></div></section>
    <section className="marquee-strip" aria-label="Technology interests"><div className="marquee-track">{[...profile.interests, ...profile.interests].map((interest, index) => <span key={`${interest}-${index}`}>{interest} <i>✳</i></span>)}</div></section>
    <section className="section"><div className="container"><div className="contact-box"><div className="eyebrow">Open to meaningful problems</div><h2 style={{margin:"14px 0"}}>Let’s build something thoughtful.</h2><p className="lead">Whether you want to discuss a project, collaboration, or engineering idea, I’d be glad to hear from you.</p><Link className="button primary" href="/contact">Get in touch <ArrowRight size={16}/></Link></div></div></section>
  </>;
}
