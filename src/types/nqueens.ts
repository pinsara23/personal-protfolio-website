export type TraceStepType = "place" | "reject" | "backtrack" | "solution";

export interface NQueensAlgorithm {
  id: string;
  name: string;
  description: string;
}

export interface TraceStep {
  i: number;
  type: TraceStepType;
  row?: number;
  col?: number;
  board?: number[];
  reason?: string;
}

export interface TraceStats {
  nodes_explored: number;
  placements: number;
  rejections: number;
  backtracks: number;
  solutions_found: number;
  elapsed_ms: number;
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
}
