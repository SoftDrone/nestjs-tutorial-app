import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateQuestionDto {
  @IsInt()
  @Min(1)
  lesson_id: number;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsInt()
  correct_answer_id: number;
}
