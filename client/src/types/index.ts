// Match types
export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  status: MatchStatus;
  startTime: string; // ISO string
  createdAt: string;
  minute?: number;
  homeLogoUrl?: string;
  awayLogoUrl?: string;
  venue?: string;
  competition?: string;
}

export interface Score {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

// Commentary types
export type CommentaryEventType =
  | "goal"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "kickoff"
  | "halftime"
  | "fulltime"
  | "penalty"
  | "var"
  | "injury"
  | "corner"
  | "foul"
  | "offside"
  | "save"
  | "comment";

export interface Commentary {
  id: number;
  matchId: number;
  minute: number;
  message: string;
  eventType: CommentaryEventType;
  metadata?: Record<string, string | number | boolean>;
  tags?: string[];
  createdAt: string;
}

// WebSocket message types
export type WsAction = "SUBSCRIBE" | "UNSUBSCRIBE";

export interface WsClientMessage {
  action: WsAction;
  matchId: number;
}

export type WsEventType =
  | "WELCOME"
  | "MATCH_CREATED"
  | "NEW_COMMENTARY"
  | "MATCH_UPDATED"
  | "SCORE_UPDATED"
  | "ERROR";

export interface WsServerMessage<T = unknown> {
  event: WsEventType;
  data: T;
}

// Connection state
export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
