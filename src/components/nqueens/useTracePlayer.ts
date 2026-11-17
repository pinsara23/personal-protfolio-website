"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TraceResponse, TraceStep } from "@/types/nqueens";

export interface PlaybackBoard {
  /** Keyed by row: queens[row] is the column or null. Never built by appending. */
  queens: (number | null)[];
  tested: { row: number; col: number } | null;
  /** Row the last move came from (for the slide animation). */
  movedFrom: number | null;
  /** Row flashed by a "dead_end" reject. */
  blockedRow: number | null;
  /** Latest reported attacking-pair count (min-conflicts). */
  conflicts: number | null;
  locked: boolean;
}

export interface PlaybackCounts {
  placements: number;
  rejections: number;
  backtracks: number;
  solutions: number;
  moves: number;
  restarts: number;
}

function buildBoard(n: number, steps: TraceStep[], currentIndex: number): PlaybackBoard {
  const queens: (number | null)[] = Array.from({ length: n }, () => null);
  let tested: PlaybackBoard["tested"] = null;
  let movedFrom: number | null = null;
  let blockedRow: number | null = null;
  let conflicts: number | null = null;
  let locked = false;

  for (let i = 0; i < currentIndex && i < steps.length; i += 1) {
    const step = steps[i];
    const hasCell = typeof step.row === "number" && typeof step.col === "number";
    if (hasCell) tested = { row: step.row as number, col: step.col as number };
    movedFrom = null;
    blockedRow = null;

    switch (step.type) {
      case "place":
        if (hasCell && (step.row as number) < n) queens[step.row as number] = step.col as number;
        break;
      case "backtrack":
        if (typeof step.row === "number" && step.row < n) queens[step.row] = null;
        break;
      case "move":
        if (hasCell && (step.row as number) < n) {
          queens[step.row as number] = step.col as number;
          movedFrom = typeof step.from_col === "number" ? step.from_col : null;
        }
        if (typeof step.conflicts === "number") conflicts = step.conflicts;
        break;
      case "restart":
        queens.fill(null);
        tested = null;
        conflicts = null;
        break;
      case "reject":
        if (typeof step.blocked_row === "number") blockedRow = step.blocked_row;
        break;
      case "solution":
        if (step.board) step.board.forEach((col, row) => { if (row < n) queens[row] = col; });
        if (conflicts !== null) conflicts = 0;
        locked = true;
        break;
    }
  }

  return { queens, tested, movedFrom, blockedRow, conflicts, locked };
}

export function useTracePlayer(trace: TraceResponse | null, speed: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const isFinished = steps.length > 0 && currentIndex >= steps.length;

  const board = useMemo(() => buildBoard(trace?.n ?? 0, steps, currentIndex), [trace?.n, steps, currentIndex]);
  const currentStep = currentIndex > 0 ? steps[currentIndex - 1] : undefined;
  const counts = useMemo<PlaybackCounts>(() => {
    const result = { placements: 0, rejections: 0, backtracks: 0, solutions: 0, moves: 0, restarts: 0 };
    for (let i = 0; i < currentIndex && i < steps.length; i += 1) {
      const type = steps[i].type;
      if (type === "place") result.placements += 1;
      else if (type === "reject") result.rejections += 1;
      else if (type === "backtrack") result.backtracks += 1;
      else if (type === "solution") result.solutions += 1;
      else if (type === "move") result.moves += 1;
      else if (type === "restart") result.restarts += 1;
    }
    return result;
  }, [steps, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setPlaying(false);
  }, [trace]);

  useEffect(() => {
    if (!playing) return;
    if (currentIndex >= steps.length) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setCurrentIndex((index) => Math.min(index + 1, steps.length)), speed);
    return () => window.clearTimeout(timer);
  }, [playing, currentIndex, steps.length, speed]);

  const stepForward = useCallback(() => setCurrentIndex((index) => Math.min(index + 1, steps.length)), [steps.length]);
  const stepBack = useCallback(() => setCurrentIndex((index) => Math.max(index - 1, 0)), []);
  const reset = useCallback(() => { setCurrentIndex(0); setPlaying(false); }, []);
  const togglePlay = useCallback(() => {
    if (isFinished) setCurrentIndex(0);
    setPlaying((value) => !value);
  }, [isFinished]);

  return { board, currentIndex, currentStep, counts, playing, isFinished, stepForward, stepBack, reset, togglePlay };
}
