import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameBoards } from './types/leader-board.interface';
import { ScoreUpdateDto } from './dto/leader-board.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LeaderBoard } from './entity/leader-board.entity';

@Injectable()
export class LeaderBoardService {
  gameBoard: GameBoards = {};
  constructor(
    @InjectRepository(LeaderBoard)
    private leadersRepository: Repository<LeaderBoard>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async leaderBoard(gameId: string, limit: number) {
    // Check if data is in cache
    const cacheKey = `leaderboard:${gameId}:${limit}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    // If cached data is found, return it
    if (cachedData) {
      return cachedData;
    }

    const leaders = this.gameBoard[gameId];
    if (!leaders) throw new NotFoundException();
    const entries = Object.entries(leaders);
    
    const data = this.sortObjectByValues(entries).slice(0, limit);
    const topPlayers = data.map((e) => ({ gameId, userId: e[0], score: e[1] }));
    //save in  cache
    await this.cacheManager.set(cacheKey, topPlayers, 600);

    return topPlayers;
  }

  updateScore(scoreUpdateDto: ScoreUpdateDto) {
    const { gameId, userId, score, timestamp } = scoreUpdateDto;
    this.gameBoard[gameId] = {
      ...this.gameBoard[gameId],
      [userId]: score,
    };
    // this.gameBoard[gameId] = this.sortObjectByValues(this.gameBoard[gameId])

    
    this.saveInDb({gameId, userId, score, timestamp});
    return { status: 'success', message: 'score updated successfully' };
  }

  sortObjectByValues(entries) {
    
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

    return sortedEntries;
  }

  //   @Cron(CronExpression.EVERY_10_SECONDS)
  async saveInDb(body) {
    const found = await this.leadersRepository.findOne({
      where: { gameId: body.gameId, userId: body.userId },
    });
    if (found) {
      await this.leadersRepository.update(
        { gameId: body.gameId, userId: body.userId },
        body,
      );
    } else {
      await this.leadersRepository.save(body);
    }
  }
}
