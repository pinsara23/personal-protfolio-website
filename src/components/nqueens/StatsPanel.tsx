"use client";

import { TraceStats } from "@/types/nqueens";
import styles from "./nqueens.module.css";

interface StatsPanelProps {
  counts: { placements: number; rejections: number; backtracks: number; solutions: number };
  current: number;
  total: number;
  finalStats?: TraceStats;
  finished: boolean;
}

export function StatsPanel({ counts, current, total, finalStats, finished }: StatsPanelProps) {
  const stats = [["placements", counts.placements], ["rejections", counts.rejections], ["backtracks", counts.backtracks], ["solutions", counts.solutions]];
  return <section className={styles.statsPanel} aria-live="polite">
    <div className={styles.statsHeader}><span className="mono">Live trace stats</span><strong>{current} / {total}</strong></div>
    <div className={styles.statGrid}>{stats.map(([label, value]) => <div className={styles.stat} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    {finished && finalStats && <div className={styles.serverStats}><span className="mono">Server result</span><p>{finalStats.nodes_explored} nodes · {finalStats.solutions_found} solutions · {finalStats.elapsed_ms}ms</p><small>Final counts reported by the backend.</small></div>}
  </section>;
}
