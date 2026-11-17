"use client";

import { TraceStep } from "@/types/nqueens";
import styles from "./nqueens.module.css";

export function StepLog({ steps, currentIndex }: { steps: TraceStep[]; currentIndex: number }) {
  const visible = steps.slice(Math.max(0, steps.length - 300));
  const offset = steps.length - visible.length;
  return <section className={styles.logPanel}>
    <div className={styles.logHeader}><span className="mono">Trace log</span><span>{steps.length} events</span></div>
    <div className={styles.log} aria-live="polite" aria-label="Solver trace events">
      {visible.length === 0 ? <p className={styles.emptyLog}>Run a trace to inspect the solver’s decisions.</p> : visible.map((step, index) => {
        const absoluteIndex = offset + index;
        const coordinates = typeof step.row === "number" && typeof step.col === "number" ? `${typeof step.from_col === "number" ? ` (${step.row + 1},${step.from_col + 1}) →` : ""} (${step.row + 1},${step.col + 1})` : "";
        const detail = [step.reason, typeof step.blocked_row === "number" ? `row ${step.blocked_row + 1} blocked` : "", typeof step.conflicts === "number" ? `${step.conflicts} conflicts` : ""].filter(Boolean).join(" · ");
        return <div className={`${styles.logLine} ${absoluteIndex === currentIndex - 1 ? styles.currentLine : ""}`} key={`${step.i}-${absoluteIndex}`}><span>{String(step.i).padStart(3, "0")}</span><strong className={styles[`type_${step.type}`]}>{step.type}</strong><span>{coordinates}</span>{detail && <small>{detail}</small>}</div>;
      })}
    </div>
  </section>;
}
