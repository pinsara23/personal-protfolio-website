"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { NQueensAlgorithm } from "@/types/nqueens";
import styles from "./nqueens.module.css";

interface ControlsProps {
  n: number;
  setN: (value: number) => void;
  algorithm: string;
  setAlgorithm: (value: string) => void;
  algorithms: NQueensAlgorithm[];
  onRun: () => void;
  loading: boolean;
  playing: boolean;
  onTogglePlay: () => void;
  onBack: () => void;
  onForward: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (value: number) => void;
  selected?: NQueensAlgorithm;
  maxN: number;
  seed: string;
  setSeed: (value: string) => void;
  onCompare: () => void;
  runDisabled?: boolean;
  playbackDisabled?: boolean;
}

export function Controls(props: ControlsProps) {
  const { n, setN, algorithm, setAlgorithm, algorithms, onRun, loading, playing, onTogglePlay, onBack, onForward, onReset, speed, setSpeed, selected, maxN, seed, setSeed, onCompare, runDisabled, playbackDisabled } = props;
  return (
    <section className={styles.controlPanel} aria-label="Trace controls">
      <div className={styles.controlGrid}>
        <label className={styles.controlLabel}>Board size <strong>{n}×{n}</strong>
          <input aria-label="Board size" type="range" min="4" max={maxN} value={n} onChange={(event) => setN(Number(event.target.value))} disabled={loading} />
        </label>
        <label className={styles.controlLabel}>Algorithm
          <select aria-label="Algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value)} disabled={loading || algorithms.length === 0}>
            {algorithms.length === 0 ? <option>Waiting for algorithms…</option> : algorithms.map((item) => <option value={item.id} key={item.id} title={item.description}>{item.name}</option>)}
          </select>
          {selected && <span className={styles.helper}>{selected.description}</span>}
        </label>
        {selected?.randomized && <label className={styles.controlLabel}>Seed (optional)
          <input aria-label="Seed" type="number" inputMode="numeric" placeholder="random each run" value={seed} onChange={(event) => setSeed(event.target.value)} disabled={loading} />
        </label>}
        <label className={styles.controlLabel}>Playback speed <strong>{speed}ms</strong>
          <input aria-label="Playback speed" type="range" min="60" max="1000" step="20" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
        </label>
      </div>
      <div className={styles.buttonRow}>
        <button className={`${styles.actionButton} ${styles.primaryAction}`} onClick={onRun} disabled={runDisabled || loading || algorithms.length === 0}>{loading ? "Fetching trace…" : selected?.randomized && seed === "" ? "Run / Re-run" : "Run / Fetch trace"}</button>
        <button className={`${styles.actionButton}`} onClick={onCompare} disabled={runDisabled || loading || algorithms.length === 0}>Compare all algorithms</button>
        <button className={styles.iconButton} onClick={onTogglePlay} disabled={playbackDisabled} aria-label={playing ? "Pause playback" : "Play playback"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
        <button className={styles.iconButton} onClick={onBack} disabled={playbackDisabled} aria-label="Step backward"><SkipBack size={17} /></button>
        <button className={styles.iconButton} onClick={onForward} disabled={playbackDisabled} aria-label="Step forward"><SkipForward size={17} /></button>
        <button className={styles.iconButton} onClick={onReset} disabled={playbackDisabled} aria-label="Reset playback"><RotateCcw size={17} /></button>
      </div>
      <p className={styles.keyboardHint}>Space play / pause · ← step back · → step forward</p>
    </section>
  );
}
