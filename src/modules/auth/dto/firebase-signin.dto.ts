import { IsString, IsNotEmpty } from 'class-validator';

export class FirebaseSignInDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
