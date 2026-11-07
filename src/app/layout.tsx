import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { TerminalOverlay } from "@/components/motion/TerminalOverlay";
import icon2 from "../../assests/icon_2.png";
const BackgroundCanvas = dynamic(() => import("@/components/three/BackgroundCanvas"), { ssr: false });

export const metadata: Metadata = {
  title: { default: "Pinsara Sarathchandra", template: "%s | Pinsara Sarathchandra" },
  description: "Portfolio of Pinsara Sarathchandra, a Computer Engineering undergraduate building practical software and systems.",
  icons: { icon: icon2.src },
  openGraph: { title: "Pinsara Sarathchandra", description: "Engineering projects across software, AI, robotics, distributed systems, and HPC", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><BackgroundCanvas /><IntroLoader /><ScrollProgress /><TerminalOverlay /><Header /><main>{children}</main><Footer /></body></html>;
}
