"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { Component, ReactNode, useEffect, useRef, useState } from "react";

const ComputeCore = dynamic(() => import("./ComputeCore"), { ssr: false });

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticCore /> : this.props.children; }
}

function StaticCore() {
  return <div className="static-core-fallback" aria-hidden="true"><div className="static-core-ring" /><div className="static-core-dot" /></div>;
}

function CoreScene() {
  const pathname = usePathname();
  const progressRef = useRef(0);
  const cursorRef = useRef({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const detail = pathname.startsWith("/projects/") && pathname !== "/projects";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    setLowPower(window.innerWidth < 700 || navigator.hardwareConcurrency <= 4);
    const move = (event: MouseEvent) => {
      cursorRef.current.x = (event.clientX / window.innerWidth - .5) * 2;
      cursorRef.current.y = (event.clientY / window.innerHeight - .5) * -2;
    };
    const updateScroll = () => {
      if (detail || reducedMotion) return;
      const anchors = ["hero", "about", "skills", "projects", "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      if (anchors.length < 2) {
        progressRef.current = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
        return;
      }
      const start = anchors[0].offsetTop;
      const end = anchors[anchors.length - 1].offsetTop;
      progressRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => { media.removeEventListener("change", updateMotion); window.removeEventListener("mousemove", move); window.removeEventListener("scroll", updateScroll); };
  }, [detail, reducedMotion]);

  if (reducedMotion) return <StaticCore />;
  return <Canvas className="compute-canvas" dpr={lowPower ? [1, 1.1] : [1, 1.5]} camera={{ position: [0, 0, 6.5], fov: 40 }} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} frameloop="always" aria-hidden="true"><ComputeCore progressRef={progressRef} cursorRef={cursorRef} detail={detail} reducedMotion={reducedMotion} lowPower={lowPower} /></Canvas>;
}

export default function BackgroundCanvas() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const browser = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let timer: number;
    let idle = false;
    if (browser.requestIdleCallback) {
      idle = true;
      timer = browser.requestIdleCallback(() => setReady(true), { timeout: 1200 });
    } else {
      timer = window.setTimeout(() => setReady(true), 500);
    }
    return () => { if (idle && browser.cancelIdleCallback) browser.cancelIdleCallback(timer); else window.clearTimeout(timer); };
  }, []);
  if (!ready) return <StaticCore />;
  return <WebGLErrorBoundary><CoreScene /></WebGLErrorBoundary>;
}
