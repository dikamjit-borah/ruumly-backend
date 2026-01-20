import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OwnersService } from '@/modules/owners/owners.service';
import { FirebaseService } from './firebase.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ownersService: OwnersService,
    private readonly firebaseService: FirebaseService,
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

  async firebaseSignIn(idToken: string) {
    try {
      // Verify the Firebase ID token
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      const email = decodedToken.email;
      const firebaseUid = decodedToken.uid;

      // Check if owner exists by email
      let owner = await this.ownersService.findByEmail(email);

      // If owner doesn't exist, create a new one
      if (!owner) {
        const name = decodedToken.name || email.split('@')[0];
        owner = await this.ownersService.create({
          email,
          name,
          firebaseUid,
          password: null, // Firebase users don't have a password
        } as any);
      }

      // Generate JWT token for the application
      const payload = {
        email: owner.email,
        sub: owner.id,
      };

      const ownerData = owner.get({ plain: true });
      //delete ownerData.password;

      return {
        access_token: this.jwtService.sign(payload),
        owner: ownerData,
      };
    } catch (error) {
      Logger.error('Firebase sign-in error:', error);
      Logger.error(error.message);
      console.error(`Firebase sign-in error: ${JSON.stringify(error)}`);
      throw new BadRequestException('Firebase authentication failed');
    }
  }
}
