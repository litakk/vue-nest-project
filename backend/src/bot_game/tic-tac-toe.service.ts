import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicTac } from '@prisma/client';

@Injectable()
export class TicTacToeService {
    constructor(private prisma: PrismaService) { }

    async createGame(playerId: string): Promise<TicTac> {
        return this.prisma.ticTac.create({
            data: { playerId },
        });
    }

    async getGame(gameId: string): Promise<TicTac | null> {
        return this.prisma.ticTac.findUnique({ where: { id: gameId } });
    }

    async makeMove(gameId: string, playerMoveIndex: number): Promise<TicTac> {
        const game = await this.getGame(gameId);
        if (!game || game.status !== 'playing') throw new Error('Invalid game');

        // ход игрока
        let boardArr = game.board.split('');
        if (boardArr[playerMoveIndex] !== '-') throw new Error('Cell occupied');

        boardArr[playerMoveIndex] = 'X'; // игрок всегда X

        // проверка победы игрока
        if (this.checkWin(boardArr, 'X')) {
            return this.prisma.ticTac.update({
                where: { id: gameId },
                data: { board: boardArr.join(''), status: 'won' },
            });
        }

        // ход робота (O)
        const robotMoveIndex = this.getRandomMove(boardArr);
        if (robotMoveIndex !== -1) {
            boardArr[robotMoveIndex] = 'O';
        }

        // проверка победы робота
        let newStatus = 'playing';
        if (this.checkWin(boardArr, 'O')) newStatus = 'lost';
        else if (!boardArr.includes('-')) newStatus = 'draw';

        return this.prisma.ticTac.update({
            where: { id: gameId },
            data: { board: boardArr.join(''), status: newStatus },
        });
    }

    private checkWin(board: string[], symbol: string): boolean {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // колонки
            [0, 4, 8], [2, 4, 6]           // диагонали
        ];
        return winPatterns.some(pattern => pattern.every(i => board[i] === symbol));
    }

    private getRandomMove(board: string[]): number {
        const emptyIndices = board.map((v, i) => v === '-' ? i : -1).filter(i => i !== -1);
        if (emptyIndices.length === 0) return -1;
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
}
