import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOwnerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
