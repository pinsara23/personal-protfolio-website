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
const DEFAULT_MAX_N = 12;

interface CompareRow { id: string; name: string; stats?: TraceResponse["stats"]; truncated?: boolean; error?: string }

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
  const [seed, setSeed] = useState("");
  const [compare, setCompare] = useState<CompareRow[] | null>(null);
  const selected = algorithms.find((item) => item.id === algorithm);
  const maxN = selected?.max_n ?? DEFAULT_MAX_N;
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
      const parsedSeed = selected?.randomized && seed.trim() !== "" ? Number.parseInt(seed, 10) : undefined;
      setTrace(await fetchTrace({ n, algorithm, max_steps: MAX_STEPS, stop_after_first_solution: true, ...(Number.isFinite(parsedSeed) ? { seed: parsedSeed } : {}) }));
    } catch (caught) {
      setError(caught instanceof NQueensApiError ? caught.message : "The trace could not be fetched.");
    } finally {
      setLoading(false);
    }
  }, [algorithm, n, selected, seed]);

  const runCompare = useCallback(async () => {
    setLoading(true);
    setError("");
    const rows: CompareRow[] = [];
    for (const item of algorithms) {
      if (n > (item.max_n ?? DEFAULT_MAX_N)) { rows.push({ id: item.id, name: item.name, error: `max ${item.max_n}` }); continue; }
      try {
        const result = await fetchTrace({ n, algorithm: item.id, max_steps: MAX_STEPS, stop_after_first_solution: true });
        rows.push({ id: item.id, name: item.name, stats: result.stats, truncated: result.truncated });
      } catch (caught) {
        rows.push({ id: item.id, name: item.name, error: caught instanceof NQueensApiError ? caught.message : "failed" });
      }
    }
    setCompare(rows);
    setLoading(false);
  }, [algorithms, n]);

  const changeAlgorithm = (value: string) => {
    setAlgorithm(value);
    setTrace(null);
    const next = algorithms.find((item) => item.id === value);
    const limit = next?.max_n ?? DEFAULT_MAX_N;
    setN((current) => Math.min(Math.max(current, 4), limit));
  };

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

  const currentDescription = player.currentStep ? `${player.currentStep.type}${typeof player.currentStep.row === "number" ? ` at row ${player.currentStep.row + 1}, column ${(player.currentStep.col ?? 0) + 1}` : ""}${typeof player.currentStep.from_col === "number" ? ` (from column ${player.currentStep.from_col + 1})` : ""}${player.currentStep.reason ? `: ${player.currentStep.reason}` : ""}${typeof player.currentStep.blocked_row === "number" ? ` (row ${player.currentStep.blocked_row + 1} blocked)` : ""}` : "Ready to inspect a solver trace.";
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className="container">
        <div className="eyebrow">Playground / N-Queens Watch Mode</div>
        <h1>Watch the solver<br /><em>make decisions.</em></h1>
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
          <Controls n={n} setN={(value) => { setN(value); setTrace(null); setCompare(null); }} algorithm={algorithm} setAlgorithm={changeAlgorithm} algorithms={algorithms} selected={selected} maxN={maxN} seed={seed} setSeed={setSeed} onCompare={() => void runCompare()} onRun={() => void runTrace()} loading={loading} playing={player.playing} onTogglePlay={player.togglePlay} onBack={player.stepBack} onForward={player.stepForward} onReset={player.reset} speed={speed} setSpeed={setSpeed} runDisabled={serverState !== "ready"} playbackDisabled={!trace} />
          <StatsPanel counts={player.counts} current={player.currentIndex} total={trace?.steps.length ?? 0} finalStats={trace?.stats} finished={player.isFinished} />
          {compare && <section className={styles.logPanel} aria-label="Algorithm comparison">
            <div className={styles.logHeader}><span className="mono">Compare · n = {n}</span><span>first solution</span></div>
            <table className={styles.compare}>
              <thead><tr><th>Algorithm</th><th>Place</th><th>Rej</th><th>Back</th><th>ms</th></tr></thead>
              <tbody>{compare.map((row) => <tr key={row.id}><td>{row.name}</td>{row.stats ? <><td>{row.stats.placements}</td><td>{row.stats.rejections}</td><td>{row.stats.backtracks}</td><td>{row.stats.elapsed_ms}{row.truncated ? "*" : ""}</td></> : <td colSpan={4}>{row.error}</td>}</tr>)}</tbody>
            </table>
          </section>}
          <StepLog steps={trace?.steps ?? []} currentIndex={player.currentIndex} />
        </div>
      </div>
    </main>
  </div>;
}
