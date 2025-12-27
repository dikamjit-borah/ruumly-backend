import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsMongoId()
  propertyId: string;

  @IsOptional()
  @IsNumber()
  floor: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  rentAmount: number;

  @IsOptional()
  @IsEnum(['vacant', 'occupied', 'maintenance', 'reserved'])
  status: string;

  @IsOptional()
  @IsNumber()
  squareFeet: number;

  @IsOptional()
  @IsNumber()
  bedrooms: number;

  @IsOptional()
  @IsNumber()
  bathrooms: number;

  @IsOptional()
  @IsArray()
  amenities: string[];

  @IsOptional()
  @IsNumber()
  depositAmount: number;
}
