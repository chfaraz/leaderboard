import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LeaderBoardService } from './leader-board.service';
import { EventType } from './types/event-type.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderBoard } from './entity/leader-board.entity';

describe('LeaderBoardService', () => {
  let service: LeaderBoardService;
  let cacheManager: Cache;
  let leadersRepository: Repository<LeaderBoard>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LeaderBoard),
          useValue: {},
        },
      ],
    }).compile();

    cacheManager = module.get<Cache>('CACHE_MANAGER');
    leadersRepository = module.get<Repository<LeaderBoard>>(
      getRepositoryToken(LeaderBoard),
    );

    service = new LeaderBoardService(leadersRepository, cacheManager);

    // Initialize gameBoard for testing
    service.gameBoard = {
      game1: {
        user2: 200, //here game scores should be sorted
        user1: 100,
        user3: 50,
      },
    };
  });

  it('should return cached data if available', async () => {
    const gameId = 'game1';
    const limit = 10;
    const cachedData = [{ gameId, userId: 'user1', score: 100 }];

    jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedData);

    const result = await service.leaderBoard(gameId, limit);

    expect(result).toEqual(cachedData);
  });

  it('should throw NotFoundException if gameId is not found', async () => {
    const gameId = 'nonExistentGame';
    const limit = 10;

    await expect(service.leaderBoard(gameId, limit)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return top players and cache the result', async () => {
    const gameId = 'game1';
    const limit = 2;

    const expectedTopPlayers = [
      { gameId, userId: 'user2', score: 200 },
      { gameId, userId: 'user1', score: 100 },
    ];

    const result = await service.leaderBoard(gameId, limit);

    expect(cacheManager.set).toHaveBeenCalledWith(
      `leaderboard:${gameId}:${limit}`,
      expectedTopPlayers,
      600,
    );
    expect(result).toEqual(expectedTopPlayers);
  });

  it('should handle empty leaderboard', async () => {
    const gameId = 'game2';
    const limit = 2;

    service.gameBoard[gameId] = {};

    const result = await service.leaderBoard(gameId, limit);

    expect(result).toEqual([]);
  });

  it('should update the score and sort the leaderboard', () => {
    const scoreUpdateDto = {
      gameId: 'game1',
      userId: 'user4',
      score: 300,
      eventType: EventType.scoreUpdate,
      timestamp: '2025-02-02T14:30:00Z',
    };

    const result = service.updateScore(scoreUpdateDto);

    expect(result).toEqual({
      status: 'success',
      message: 'score updated successfully',
    });
    expect(service.gameBoard['game1']).toEqual({
      user4: 300,
      user2: 200,
      user1: 100,
      user3: 50,
    });
  });

  it('should create a new game entry if gameId does not exist', () => {
    const scoreUpdateDto = {
      gameId: 'newGame',
      userId: 'user1',
      score: 100,
      eventType: EventType.scoreUpdate,
      timestamp: '2025-02-02T14:30:00Z',
    };

    const result = service.updateScore(scoreUpdateDto);

    expect(result).toEqual({
      status: 'success',
      message: 'score updated successfully',
    });
    expect(service.gameBoard['newGame']).toEqual({
      user1: 100,
    });
  });
});
