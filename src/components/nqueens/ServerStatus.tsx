"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, RotateCcw } from "lucide-react";
import styles from "./nqueens.module.css";

export type ServerState = "waking" | "ready" | "unavailable" | "unconfigured";

export function ServerStatus({ state, message, onRetry }: { state: ServerState; message?: string; onRetry: () => void }) {
  if (state === "ready") return <div className={`${styles.serverStatus} ${styles.ready}`} role="status"><CheckCircle2 size={15} /> Server ready</div>;
  if (state === "unconfigured") return <div className={`${styles.serverStatus} ${styles.unavailable}`} role="status"><AlertCircle size={15} /> Backend not configured <small>Set NEXT_PUBLIC_API_URL</small></div>;
  if (state === "unavailable") return <div className={`${styles.serverStatus} ${styles.unavailable}`} role="status"><AlertCircle size={15} /> Server unavailable <button onClick={onRetry} aria-label="Retry server connection"><RotateCcw size={14} /></button>{message && <small>{message}</small>}</div>;
  return <div className={`${styles.serverStatus} ${styles.waking}`} role="status"><LoaderCircle size={15} /> Waking up the solver…</div>;
}
