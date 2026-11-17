"use client";

import { Crown } from "lucide-react";
import { PlaybackBoard } from "./useTracePlayer";
import { TraceStep } from "@/types/nqueens";
import styles from "./nqueens.module.css";

interface BoardProps {
  n: number;
  board: PlaybackBoard;
  currentStep?: TraceStep;
}

/** Rows whose queen shares a column or diagonal with another queen. */
function attackedRows(queens: (number | null)[]): Set<number> {
  const result = new Set<number>();
  const placed: [number, number][] = [];
  queens.forEach((col, row) => { if (col !== null) placed.push([row, col]); });
  const byCol = new Map<number, number[]>();
  const byDiag = new Map<number, number[]>();
  const byAnti = new Map<number, number[]>();
  const add = (map: Map<number, number[]>, key: number, row: number) => map.set(key, [...(map.get(key) ?? []), row]);
  placed.forEach(([row, col]) => { add(byCol, col, row); add(byDiag, row - col, row); add(byAnti, row + col, row); });
  [byCol, byDiag, byAnti].forEach((map) => map.forEach((rows) => { if (rows.length > 1) rows.forEach((row) => result.add(row)); }));
  return result;
}

export function Board({ n, board, currentStep }: BoardProps) {
  const cell = 100 / n;
  const box = (row: number, col: number): React.CSSProperties => ({ top: `${row * cell}%`, left: `${col * cell}%`, width: `${cell}%`, height: `${cell}%` });
  const attacked = board.conflicts !== null || currentStep?.type === "place" ? attackedRows(board.queens) : new Set<number>();
  const tested = board.tested;
  const testedClass = currentStep?.type === "reject" ? styles.rejected : currentStep?.type === "backtrack" ? styles.backtrack : styles.tested;
  const solved = currentStep?.type === "solution";
  const showCurrentCell = tested && currentStep && currentStep.type !== "restart" && currentStep.type !== "solution";

  return (
    <div className={styles.boardShell}>
      <div className={styles.board} style={{ "--board-size": n } as React.CSSProperties} role="img" aria-label={`${n} by ${n} N-Queens board with ${board.queens.filter((q) => q !== null).length} queens`}>
        {board.blockedRow !== null && board.blockedRow < n && <div className={styles.blockedRow} style={{ top: `${board.blockedRow * cell}%`, height: `${cell}%` }} />}
        {showCurrentCell && <div className={`${styles.marker} ${testedClass}`} style={box(tested.row, tested.col)} />}
        {board.queens.map((col, row) => col === null ? null : (
          <div
            key={row}
            className={`${styles.queenBox} ${attacked.has(row) ? styles.attacked : ""} ${solved ? styles.solvedQueen : ""}`}
            style={box(row, col)}
          >
            <Crown className={styles.queen} size="72%" aria-label={`Queen at row ${row + 1}, column ${col + 1}`} />
          </div>
        ))}
      </div>
      {board.conflicts !== null && <p className={styles.conflicts} aria-live="polite">Conflicts <strong>{board.conflicts}</strong></p>}
    </div>
  );
}
