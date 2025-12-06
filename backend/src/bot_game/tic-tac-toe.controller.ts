import { Controller, Post, Param, Body } from '@nestjs/common';
import { TicTacToeService } from './tic-tac-toe.service';

@Controller('tic-tac-toe')
export class TicTacToeController {
    constructor(private readonly tttService: TicTacToeService) { }

    @Post('create/:playerId')
    create(@Param('playerId') playerId: string) {
        return this.tttService.createGame(playerId);
    }

    @Post('move/:gameId')
    makeMove(@Param('gameId') gameId: string, @Body('index') index: number) {
        return this.tttService.makeMove(gameId, index);
    }
}
