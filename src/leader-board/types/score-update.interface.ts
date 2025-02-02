import { EventType } from "./event-type.enum";

export interface ScoreUpdateEvent {
    eventType: EventType;
    userId: string;
    gameId: string;
    score: number;
    timestamp: string; // ISO 8601 format
  }