import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OwnersService } from '@/modules/owners/owners.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ownersService: OwnersService,
  ) {}

  async validateUser(email: string, password: string) {
    const owner = await this.ownersService.findByEmail(email);
    if (owner && (await this.comparePasswords(password, owner.password))) {
      const { password, ...result } = owner.get({ plain: true });
      return result;
    }
    return null;
  }

  async login(owner: AuthDto) {
    const validatedOwner = await this.validateUser(owner.email, owner.password);
    if (!validatedOwner) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      email: validatedOwner.email,
      sub: validatedOwner.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      owner: validatedOwner,
    };
  }

  async register(email: string, password: string, name: string) {
    const hashedPassword = await this.hashPassword(password);
    const owner = await this.ownersService.create({
      email,
      password: hashedPassword,
      name,
    });

    const { password: _, ...result } = owner.get({ plain: true });
    const payload = {
      email: result.email,
      sub: result.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      owner: result,
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
