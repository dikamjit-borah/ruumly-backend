import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsNumber()
  totalRooms: number;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'maintenance'])
  status: string;
}
