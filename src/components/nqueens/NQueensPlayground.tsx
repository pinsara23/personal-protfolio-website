"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { fetchAlgorithms, fetchTrace, checkHealth, NQueensApiError } from "@/lib/nqueensApi";
import { NQueensAlgorithm, TraceResponse } from "@/types/nqueens";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { ServerState, ServerStatus } from "./ServerStatus";
import { StatsPanel } from "./StatsPanel";
import { StepLog } from "./StepLog";
import { useTracePlayer } from "./useTracePlayer";
import styles from "./nqueens.module.css";

const MAX_STEPS = 5000;

export function NQueensPlayground() {
  const [n, setN] = useState(8);
  const [algorithm, setAlgorithm] = useState("");
  const [algorithms, setAlgorithms] = useState<NQueensAlgorithm[]>([]);
  const [trace, setTrace] = useState<TraceResponse | null>(null);
  const [serverState, setServerState] = useState<ServerState>(process.env.NEXT_PUBLIC_API_URL ? "waking" : "unconfigured");
  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(240);
  const player = useTracePlayer(trace, speed);

  const connect = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      setServerState("unconfigured");
      return;
    }
    setServerState("waking");
    setServerMessage("");
    setError("");
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        await checkHealth();
        const result = await fetchAlgorithms();
        setAlgorithms(result.algorithms);
        setAlgorithm((current) => current || result.algorithms[0]?.id || "");
        setServerState("ready");
        return;
      } catch (caught) {
        if (attempt === 3) {
          const message = caught instanceof NQueensApiError ? caught.message : "The backend could not be reached.";
          setServerState("unavailable");
          setServerMessage(message);
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 1500 * (attempt + 1)));
      }
    }
  }, []);

  useEffect(() => { void connect(); }, [connect]);

  const runTrace = useCallback(async () => {
    if (!algorithm) return;
    setLoading(true);
    setError("");
    try {
      setTrace(await fetchTrace({ n, algorithm, max_steps: MAX_STEPS, stop_after_first_solution: true }));
    } catch (caught) {
      setError(caught instanceof NQueensApiError ? caught.message : "The trace could not be fetched.");
    } finally {
      setLoading(false);
    }
  }, [algorithm, n]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === " ") { event.preventDefault(); player.togglePlay(); }
      if (event.key === "ArrowLeft") player.stepBack();
      if (event.key === "ArrowRight") player.stepForward();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [player]);

  const currentDescription = player.currentStep ? `${player.currentStep.type}${typeof player.currentStep.row === "number" ? ` at row ${player.currentStep.row + 1}, column ${(player.currentStep.col ?? 0) + 1}` : ""}${player.currentStep.reason ? `: ${player.currentStep.reason}` : ""}` : "Ready to inspect a solver trace.";
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className="container">
        <div className="eyebrow">Playground / N-Queens Watch Mode</div>
        <h1>Watch backtracking<br /><em>make decisions.</em></h1>
        <p className="lead">N-Queens asks the solver to place one queen per row without sharing a column or diagonal. This watch mode renders the real backend trace: placements are tried, conflicts are rejected, and dead ends are undone.</p>
        <ServerStatus state={serverState} message={serverMessage} onRetry={() => void connect()} />
        <p className={styles.wakeNote}>The free backend may sleep between visits. The first request can take 30–60 seconds.</p>
      </div>
    </section>
    <main className="container">
      {error && <div className={styles.error} role="alert"><AlertTriangle size={17} />{error}</div>}
      {trace?.truncated && <div className={styles.notice} role="status"><AlertTriangle size={17} /> This trace was cut off at {MAX_STEPS} events. The result is partial.</div>}
      <div className={styles.workspace}>
        <div>
          <Board n={n} board={player.board} currentStep={player.currentStep} />
          <p className={styles.currentStep} aria-live="polite"><span className="mono">Current event</span> {currentDescription}</p>
        </div>
        <div className={styles.sideColumn}>
          <Controls n={n} setN={(value) => { setN(value); setTrace(null); }} algorithm={algorithm} setAlgorithm={(value) => { setAlgorithm(value); setTrace(null); }} algorithms={algorithms} onRun={() => void runTrace()} loading={loading} playing={player.playing} onTogglePlay={player.togglePlay} onBack={player.stepBack} onForward={player.stepForward} onReset={player.reset} speed={speed} setSpeed={setSpeed} runDisabled={serverState !== "ready"} playbackDisabled={!trace} />
          <StatsPanel counts={player.counts} current={player.currentIndex} total={trace?.steps.length ?? 0} finalStats={trace?.stats} finished={player.isFinished} />
          <StepLog steps={trace?.steps ?? []} currentIndex={player.currentIndex} />
        </div>
      </div>
    </main>
  </div>;
}
