
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  //  async register(password, email) {
  //   const user = await this.usersService.findOneByEmail(email);

  //   if (user) {
  //     throw new BadRequestException("Email already exists");
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // await this.usersService.create({
  //   //   email,
  //   //   password: hashedPassword,
  //   // });

  //   await this.usersService.create(
  //     email,
  //     hashedPassword
  //   )

  //   return {
  //     message: "User created successfully",
  //   };
  // }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
