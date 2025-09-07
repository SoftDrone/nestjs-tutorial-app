import { Question } from '../entities/question.entity';
import { Answer } from '../entities/answer.entity';

export class AnswerResponseDto {
  id: number;
  text: string;
  is_correct: boolean;

  constructor(answer: Answer) {
    this.id = answer.id;
    this.text = answer.text;
    this.is_correct = answer.is_correct;
  }
}

export class QuestionResponseDto {
  id: number;
  question_text: string;
  lesson_id: number;
  created_at: Date;
  updated_at: Date;
  answers: AnswerResponseDto[];

  constructor(question: Question) {
    this.id = question.id;
    this.question_text = question.question_text;
    this.lesson_id = question.lesson?.id;
    this.created_at = question.created_at;
    this.updated_at = question.updated_at;
    this.answers = question.answers?.map((a) => new AnswerResponseDto(a)) || [];
  }
}
