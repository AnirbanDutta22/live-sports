import type {
  Match,
  Commentary,
  CommentaryEventType,
  MatchStatus,
} from "../types";

// ─── Request/Response shapes ────────────────────────────────────────────────

export interface CreateMatchPayload {
  homeTeam: string;
  awayTeam: string;
  sport: string;
  status: MatchStatus;
  startTime: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  competition?: string;
  homeLogoUrl?: string;
  awayLogoUrl?: string;
}

export interface UpdateMatchPayload extends Partial<CreateMatchPayload> {
  id: number;
}

export interface UpdateScorePayload {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

export interface CreateCommentaryPayload {
  matchId: number;
  minute: number;
  message: string;
  eventType: CommentaryEventType;
  metadata?: Record<string, string | number | boolean>;
  tags?: string[];
}

// ─── Generic fetch wrapper ───────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    let msg = `${res.status} ${res.statusText}`;
    try {
      const json = JSON.parse(body);
      msg = json.message ?? json.error ?? msg;
    } catch {
      // raw text
    }
    throw new Error(msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Match API ───────────────────────────────────────────────────────────────

export const adminApi = {
  // Matches
  getMatches: (limit = 50): Promise<Match[]> =>
    apiFetch(`/api/matches?limit=${limit}`),

  getMatch: (id: number): Promise<Match> => apiFetch(`/api/matches/${id}`),

  createMatch: (payload: CreateMatchPayload): Promise<Match> =>
    apiFetch("/api/matches", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMatch: ({ id, ...payload }: UpdateMatchPayload): Promise<Match> =>
    apiFetch(`/api/matches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateScore: ({
    matchId,
    homeScore,
    awayScore,
  }: UpdateScorePayload): Promise<Match> =>
    apiFetch(`/api/matches/score`, {
      method: "PATCH",
      body: JSON.stringify({ matchId, homeScore, awayScore }),
    }),

  deleteMatch: (id: number): Promise<void> =>
    apiFetch(`/api/matches/${id}`, { method: "DELETE" }),

  // Commentary
  getCommentary: (matchId: number): Promise<Commentary[]> =>
    apiFetch(`/api/commentary/match/${matchId}`),

  createCommentary: (payload: CreateCommentaryPayload): Promise<Commentary> =>
    apiFetch("/api/commentary", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
