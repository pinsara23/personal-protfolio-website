"use client";

import { AlertTriangle, Crown, RotateCcw, Sparkles } from "lucide-react";
import { PlaybackBoard } from "./useTracePlayer";
import { TraceStep } from "@/types/nqueens";
import styles from "./nqueens.module.css";

interface BoardProps {
  n: number;
  board: PlaybackBoard;
  currentStep?: TraceStep;
}

export function Board({ n, board, currentStep }: BoardProps) {
  return (
    <div className={styles.boardShell}>
      <div className={styles.board} style={{ "--board-size": n } as React.CSSProperties} aria-label={`${n} by ${n} N-Queens board`}>
        {Array.from({ length: n * n }, (_, index) => {
          const row = Math.floor(index / n);
          const col = index % n;
          const isTested = board.tested?.row === row && board.tested.col === col;
          const isQueen = board.queens[row] === col;
          const isRejected = isTested && currentStep?.type === "reject";
          const isBacktrack = isTested && currentStep?.type === "backtrack";
          const isSolution = currentStep?.type === "solution" && isQueen;
          const state = [isRejected && styles.rejected, isBacktrack && styles.backtrack, isTested && styles.tested, isSolution && styles.solution].filter(Boolean).join(" ");
          return (
            <div className={`${styles.cell} ${state}`} key={`${row}-${col}`}>
              {isQueen && <Crown className={styles.queen} size={n > 9 ? 18 : 24} aria-label={`Queen at row ${row + 1}, column ${col + 1}`} />}
              {isRejected && <AlertTriangle className={styles.stateIcon} size={14} aria-hidden="true" />}
              {isBacktrack && <RotateCcw className={styles.stateIcon} size={14} aria-hidden="true" />}
              {isSolution && <Sparkles className={styles.stateIcon} size={14} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
