"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CommandPalette } from "@/components/motion/CommandPalette";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Home", "/"], ["Projects", "/projects"], ["About", "/about"], ["Skills", "/skills"], ["Contact", "/contact"]];
  return <header className="site-header"><div className="container nav">
    <Link href="/" className="brand" onClick={() => setOpen(false)}>PS<span>.</span></Link>
    <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
      {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
    </nav><CommandPalette />
  </div></header>;
}
