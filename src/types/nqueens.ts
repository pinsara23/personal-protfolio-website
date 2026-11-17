export type TraceStepType = "place" | "reject" | "backtrack" | "solution" | "move" | "restart";

export interface NQueensAlgorithm {
  id: string;
  name: string;
  description: string;
  category?: "exact" | "local_search";
  finds_all?: boolean;
  max_n?: number;
  randomized?: boolean;
}

export interface TraceStep {
  i: number;
  type: TraceStepType;
  row?: number;
  col?: number;
  board?: number[];
  reason?: string;
  from_col?: number;
  conflicts?: number;
  blocked_row?: number;
}

export interface TraceStats {
  nodes_explored: number;
  placements: number;
  rejections: number;
  backtracks: number;
  solutions_found: number;
  elapsed_ms: number;
  moves?: number;
  restarts?: number;
}

export interface TraceResponse {
  n: number;
  algorithm: string;
  steps: TraceStep[];
  stats: TraceStats;
  truncated: boolean;
}

export interface TraceRequest {
  n: number;
  algorithm: string;
  max_steps: number;
  stop_after_first_solution: boolean;
  seed?: number;
}
