import { IsString, MinLength } from 'class-validator';

export class CreateSignInDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}