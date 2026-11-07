"use client";

import { useEffect, useState } from "react";

export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [point, setPoint] = useState({ x: -40, y: -40 });
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches);
    if (!fine.matches) return;
    const move = (event: MouseEvent) => setPoint({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  if (!enabled) return null;
  return <div className="cursor-follower" style={{ transform: `translate3d(${point.x}px, ${point.y}px, 0)` }} aria-hidden="true" />;
}
