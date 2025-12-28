import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateOwnerDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
