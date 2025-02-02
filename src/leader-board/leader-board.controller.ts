import { Controller, Get, Post,Param ,Query,Body} from '@nestjs/common';
import { LeaderBoardService } from './leader-board.service';
import { ScoreUpdateDto } from './dto/leader-board.dto';

@Controller('leader-board')
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Get(':gameId')
  leaderBoard(@Param('gameId') gameId: string, @Query('limit') limit: number) {
    return this.leaderBoardService.leaderBoard(gameId, limit);
  }

  @Post('update-score')
  updateScore(@Body() scoreUpdateDto: ScoreUpdateDto) {
    return this.leaderBoardService.updateScore(scoreUpdateDto);
  }
}
