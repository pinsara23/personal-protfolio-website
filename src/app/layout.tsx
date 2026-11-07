import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { TerminalOverlay } from "@/components/motion/TerminalOverlay";
const BackgroundCanvas = dynamic(() => import("@/components/three/BackgroundCanvas"), { ssr: false });

export const metadata: Metadata = {
  title: { default: "Pinsara Sarathchandra | Computer Engineering", template: "%s | Pinsara Sarathchandra" },
  description: "Portfolio of Pinsara Sarathchandra, a Computer Engineering undergraduate building practical software and systems.",
  openGraph: { title: "Pinsara Sarathchandra | Computer Engineering", description: "Engineering projects across software, AI, robotics, distributed systems, and HPC", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><BackgroundCanvas /><IntroLoader /><ScrollProgress /><CursorFollower /><TerminalOverlay /><Header /><main>{children}</main><Footer /></body></html>;
}
