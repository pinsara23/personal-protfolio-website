"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TraceResponse, TraceStep } from "@/types/nqueens";

export interface PlaybackBoard {
  queens: (number | null)[];
  tested: { row: number; col: number } | null;
  locked: boolean;
}

function buildBoard(n: number, steps: TraceStep[], currentIndex: number): PlaybackBoard {
  const queens: (number | null)[] = Array.from({ length: n }, () => null);
  let tested: { row: number; col: number } | null = null;
  let locked = false;

  steps.slice(0, currentIndex).forEach((step) => {
    if (typeof step.row === "number" && typeof step.col === "number") {
      tested = { row: step.row, col: step.col };
    }
    if (step.type === "place" && typeof step.row === "number" && typeof step.col === "number") queens[step.row] = step.col;
    if (step.type === "backtrack" && typeof step.row === "number") queens[step.row] = null;
    if (step.type === "solution" && step.board) {
      step.board.forEach((col, row) => { queens[row] = col; });
      locked = true;
    }
  });

  return { queens, tested, locked };
}

export function useTracePlayer(trace: TraceResponse | null, speed: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const steps = useMemo(() => trace?.steps ?? [], [trace]);
  const isFinished = steps.length > 0 && currentIndex >= steps.length;

  const board = useMemo(() => buildBoard(trace?.n ?? 0, steps, currentIndex), [trace?.n, steps, currentIndex]);
  const currentStep = currentIndex > 0 ? steps[currentIndex - 1] : undefined;
  const playedSteps = steps.slice(0, currentIndex);
  const counts = useMemo(() => playedSteps.reduce((result, step) => {
    if (step.type === "place") result.placements += 1;
    if (step.type === "reject") result.rejections += 1;
    if (step.type === "backtrack") result.backtracks += 1;
    if (step.type === "solution") result.solutions += 1;
    return result;
  }, { placements: 0, rejections: 0, backtracks: 0, solutions: 0 }), [playedSteps]);

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

  return {
    board,
    currentIndex,
    currentStep,
    counts,
    playing,
    isFinished,
    stepForward,
    stepBack,
    reset,
    togglePlay,
  };
}
