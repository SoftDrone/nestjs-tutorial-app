import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateLessonDto {
  @IsInt()
  @Min(1)
  unit_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  index: number;
}