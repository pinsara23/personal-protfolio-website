"use client";

import { PlaybackCounts } from "./useTracePlayer";
import { TraceStats } from "@/types/nqueens";
import styles from "./nqueens.module.css";

interface StatsPanelProps {
  counts: PlaybackCounts;
  current: number;
  total: number;
  finalStats?: TraceStats;
  finished: boolean;
}

export function StatsPanel({ counts, current, total, finalStats, finished }: StatsPanelProps) {
  const stats: [string, number][] = [["placements", counts.placements], ["rejections", counts.rejections], ["backtracks", counts.backtracks], ["solutions", counts.solutions]];
  const totalMoves = finalStats?.moves ?? 0;
  const totalRestarts = finalStats?.restarts ?? 0;
  if (counts.moves > 0 || totalMoves > 0) stats.push(["moves", counts.moves]);
  if (counts.restarts > 0 || totalRestarts > 0) stats.push(["restarts", counts.restarts]);
  return <section className={styles.statsPanel} aria-live="polite">
    <div className={styles.statsHeader}><span className="mono">Live trace stats</span><strong>{current} / {total}</strong></div>
    <div className={styles.statGrid}>{stats.map(([label, value]) => <div className={styles.stat} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    {finished && finalStats && <div className={styles.serverStats}><span className="mono">Server result</span><p>{finalStats.nodes_explored} nodes · {finalStats.solutions_found} solutions{totalMoves > 0 ? ` · ${totalMoves} moves` : ""}{totalRestarts > 0 ? ` · ${totalRestarts} restarts` : ""} · {finalStats.elapsed_ms}ms</p><small>Final counts reported by the backend.</small></div>}
  </section>;
}
