// user-lesson.dto.ts
import { IsInt, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class UserLessonDto {
  @IsInt()
  userId: number;

  @IsInt()
  lessonId: number;

  @IsInt()
  @IsOptional()
  score?: number;

  @IsBoolean()
  @IsOptional()
  passed?: boolean;

  @IsArray()
  @IsOptional()
  answers?: {
    questionId: number;
    selectedAnswerId: number;
    isCorrect?: boolean;
  }[];
}
