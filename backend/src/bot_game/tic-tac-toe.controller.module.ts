import { PrismaModule } from "src/prisma/prisma.module";
import { TicTacToeController } from "./tic-tac-toe.controller";
import { TicTacToeService } from "./tic-tac-toe.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [TicTacToeController],
    providers: [TicTacToeService],
})
export class TicTacToeModule { }
