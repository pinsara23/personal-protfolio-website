"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Play, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assests/icon_1.jpg";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Home", "/"], ["Projects", "/projects"], ["About", "/about"], ["Skills", "/skills"], ["Contact", "/contact"]];
  return <header className="site-header"><div className="container nav">
    <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Pinsara Sarathchandra home"><Image src={logo} alt="" className="brand-logo" priority /></Link>
    <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
      {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/playground/n-queens" onClick={() => setOpen(false)}><Play size={12} aria-hidden="true" /> Queens Lab</Link>
    </nav>
  </div></header>;
}
