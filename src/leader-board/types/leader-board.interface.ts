export interface GameBoards {
    [gameId: string]: {
      [userId: string]: number;
    };
  }