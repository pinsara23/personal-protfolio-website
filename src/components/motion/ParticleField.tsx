"use client";

import { useEffect, useRef } from "react";

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const parent = canvas.parentElement;
    let frame = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (parent?.clientWidth || window.innerWidth) * ratio;
      canvas.height = (parent?.clientHeight || window.innerHeight) * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = window.innerWidth < 700 ? 22 : 42;
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18 }));
    };
    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      nodes.forEach((node) => {
        node.x = (node.x + node.vx + width) % width;
        node.y = (node.y + node.vy + height) % height;
        context.fillStyle = "rgba(198,255,61,.65)";
        context.fillRect(node.x, node.y, 1.5, 1.5);
        nodes.forEach((other) => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 105) {
            context.strokeStyle = `rgba(61,220,255,${(1 - distance / 105) * .12})`;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        });
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas className="particle-field" ref={ref} aria-hidden="true" />;
}
