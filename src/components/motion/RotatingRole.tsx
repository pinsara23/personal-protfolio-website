"use client";

import { useEffect, useState } from "react";

const roles = ["Backend", "AI", "Robotics", "Embedded", "HPC"];

export function RotatingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % roles.length), 2200);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="role-rotate" aria-live="polite">{roles[index]}</span>;
}
