import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateResultDto {
  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  @IsObject()
  answers: Record<string, number>;
}
