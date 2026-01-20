import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOwnerDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
