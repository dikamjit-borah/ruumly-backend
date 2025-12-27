import { IsMongoId, IsNumber, IsOptional, IsEnum, IsString, IsDate } from 'class-validator';

export class CreateRentDto {
  @IsMongoId()
  tenantId: string;

  @IsMongoId()
  roomId: string;

  @IsMongoId()
  propertyId: string;

  @IsNumber()
  amount: number;

  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsDate()
  paidDate: Date;

  @IsOptional()
  @IsEnum(['pending', 'partial', 'paid', 'overdue'])
  status: string;

  @IsOptional()
  @IsNumber()
  amountPaid: number;

  @IsOptional()
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  notes: string;
}
