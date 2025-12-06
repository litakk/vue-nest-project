import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // внедряем JwtService
  ) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(name, email, hashedPassword);
    const { password: _, ...result } = user;
    return result;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.checkUser(email, password);

    const { password: _, ...cleanUser } = user;

    // payload для токена
    const payload = { id: user.id, email: user.email };

    // создаём JWT
    const token = this.jwtService.sign(payload);

    return {
      user: cleanUser,
      token,
    };
  }
}
