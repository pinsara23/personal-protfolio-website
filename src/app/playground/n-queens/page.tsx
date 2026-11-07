import type { Metadata } from "next";
import { NQueensPlayground } from "@/components/nqueens/NQueensPlayground";

export const metadata: Metadata = {
  title: "N-Queens Watch Mode",
  description: "Watch a real N-Queens backtracking trace step by step.",
  openGraph: {
    title: "N-Queens Watch Mode | Pinsara Sarathchandra",
    description: "Explore a live, step-by-step N-Queens backtracking trace.",
    type: "website",
  },
};

export default function NQueensPage() {
  return <NQueensPlayground />;
}
