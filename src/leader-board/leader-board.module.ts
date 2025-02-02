import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaderBoardService } from './leader-board.service';
import { LeaderBoardController } from './leader-board.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { LeaderBoard } from './entity/leader-board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaderBoard]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600, // Cache TTL in seconds (10 minutes)
    }),
  ],
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService],
  exports: [LeaderBoardService],
})
export class LeaderBoardModule {}
