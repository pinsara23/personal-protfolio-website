"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Play, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import logo from "../../assests/icon_1.jpg";
import styles from "./Header.module.css";

const links = [["Home", "/"], ["Projects", "/projects"], ["About", "/about"], ["Skills", "/skills"], ["Contact", "/contact"]];
const MENU_ID = "mobile-menu";
const DESKTOP_QUERY = "(min-width: 761px)";
const FOCUSABLE = 'a[href], button:not([disabled])';

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close when the viewport reaches the desktop breakpoint.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) setOpen(false); };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Scroll lock, inert background, focus management, Escape and focus trap.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement: html } = document;
    const toggle = toggleRef.current;
    const prevBody = body.style.overflow;
    const prevHtml = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    const background = Array.from(body.children).filter((el) => !el.hasAttribute("data-mobile-menu") && el.tagName !== "SCRIPT") as HTMLElement[];
    background.forEach((el) => { el.inert = true; el.setAttribute("aria-hidden", "true"); });

    const focusables = () => Array.from(overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    window.requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      else if (!overlayRef.current?.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
      background.forEach((el) => { el.inert = false; el.removeAttribute("aria-hidden"); });
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const slide = reduceMotion ? 0 : 14;
  const duration = reduceMotion ? 0 : 0.22;

  return <header className="site-header"><div className="container nav">
    <Link href="/" className="brand" aria-label="Pinsara Sarathchandra home"><Image src={logo} alt="" className="brand-logo" priority /></Link>
    <button ref={toggleRef} className="mobile-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls={MENU_ID} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
    <nav className="nav-links" aria-label="Main navigation">
      {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      <Link href="/playground/n-queens"><Play size={12} aria-hidden="true" /> Queens Lab</Link>
    </nav>
  </div>
  {mounted && createPortal(
    <AnimatePresence>
      {open && <motion.div
        key="menu"
        id={MENU_ID}
        ref={overlayRef}
        data-mobile-menu=""
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={styles.overlay}
        initial={{ opacity: 0, y: -slide }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -slide }}
        transition={{ duration, ease: "easeOut" }}
      >
        <div className={styles.bar}>
          <Link href="/" className={styles.logo} aria-label="Pinsara Sarathchandra home" onClick={close}><Image src={logo} alt="" /></Link>
          <button className={styles.close} aria-label="Close menu" onClick={close}><X /></button>
        </div>
        <ul className={styles.list}>
          {[...links, ["Queens Lab", "/playground/n-queens"]].map(([label, href], index) => <motion.li
            key={href}
            initial={{ opacity: 0, y: slide }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: reduceMotion ? 0 : 0.05 + index * 0.04, ease: "easeOut" }}
          >
            <Link href={href} className={styles.link} onClick={close}>{href === "/playground/n-queens" && <Play size={14} aria-hidden="true" />}{label}</Link>
          </motion.li>)}
        </ul>
      </motion.div>}
    </AnimatePresence>,
    document.body,
  )}
  </header>;
}
