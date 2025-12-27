import { IsString, IsOptional, IsEmail, IsMongoId, IsDate, IsNumber } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsMongoId()
  roomId: string;

  @IsMongoId()
  propertyId: string;

  @IsOptional()
  @IsString()
  idNumber: string;

  @IsOptional()
  @IsString()
  emergencyContact: string;

  @IsOptional()
  @IsString()
  emergencyPhone: string;

  @IsOptional()
  @IsDate()
  checkInDate: Date;

  @IsOptional()
  @IsNumber()
  depositPaid: number;

  @IsOptional()
  @IsNumber()
  rentAmount: number;

  @IsOptional()
  @IsString()
  document: string;

  @IsOptional()
  @IsString()
  notes: string;
}
