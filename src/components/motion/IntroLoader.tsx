"use client";

import { useEffect, useState } from "react";

export function IntroLoader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("ps-booted")) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("ps-booted", "1");
      setVisible(false);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className="boot-loader" role="status" aria-label="Loading portfolio">
    <div className="boot-lines"><span>&gt; initializing portfolio...</span><span>&gt; loading project registry... <b>17 projects</b></span><span>&gt; system ready_</span></div>
  </div>;
}
