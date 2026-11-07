import { NQueensAlgorithm, TraceRequest, TraceResponse } from "@/types/nqueens";

const REQUEST_TIMEOUT_MS = 65000;

export class NQueensApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "NQueensApiError";
  }
}

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  if (!url) {
    throw new NQueensApiError("Backend not configured. Set NEXT_PUBLIC_API_URL to the solver URL.");
  }
  return url;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    if (!response.ok) {
      if (response.status === 422) throw new NQueensApiError("The solver rejected these settings. Choose a board size from 4 to 12.", 422);
      if (response.status === 429) throw new NQueensApiError("The solver is rate-limited right now. Wait a moment and try again.", 429);
      throw new NQueensApiError(`The solver returned an error (${response.status}). Try again shortly.`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof NQueensApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NQueensApiError("The solver took too long to respond. It may be waking from sleep; try again.");
    }
    throw new NQueensApiError("The solver could not be reached. Check the backend and try again.");
  } finally {
    window.clearTimeout(timeout);
  }
}

export function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>("/health");
}

export function fetchAlgorithms(): Promise<{ algorithms: NQueensAlgorithm[] }> {
  return request<{ algorithms: NQueensAlgorithm[] }>("/api/algorithms");
}

export function fetchTrace(input: TraceRequest): Promise<TraceResponse> {
  return request<TraceResponse>("/api/trace", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
