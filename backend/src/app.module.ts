import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TicTacToeModule } from './bot_game/tic-tac-toe.controller.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
    imports: [
    PrismaModule,
    UserModule,
    TicTacToeModule
  ],
})
export class AppModule { }
