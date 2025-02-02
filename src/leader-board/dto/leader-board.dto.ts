import { IsString, IsInt, IsISO8601, IsEnum } from 'class-validator';
import { EventType } from '../types/event-type.enum';

export class ScoreUpdateDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  userId: string;

  @IsString()
  gameId: string;

  @IsInt()
  score: number;

  @IsISO8601()
  timestamp: string;
}