import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { FirebaseSignInDto } from './dto/firebase-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    try {
      return await this.authService.login(authDto);
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    } catch (error) {
      throw new BadRequestException('Failed to register user');
    }
  }

  @Post('firebase/signin')
  @HttpCode(HttpStatus.OK)
  async firebaseSignIn(@Body() firebaseSignInDto: FirebaseSignInDto) {
    try {
      return await this.authService.firebaseSignIn(firebaseSignInDto.idToken);
    } catch (error) {
      throw new BadRequestException('Firebase authentication failed');
    }
  }
}
