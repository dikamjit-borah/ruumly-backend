import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '@/modules/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.comparePasswords(password, user.password))) {
      const { password, ...result } = user.get({ plain: true });
      return result;
    }
    return null;
  }

  async login(user: AuthDto) {
    const validatedUser = await this.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      email: validatedUser.email,
      sub: validatedUser.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: validatedUser,
    };
  }

  async register(email: string, password: string, name: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    const { password: _, ...result } = user.get({ plain: true });
    const payload = {
      email: result.email,
      sub: result.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
