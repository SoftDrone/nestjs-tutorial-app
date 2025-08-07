import { Question } from '../entities/question.entity';

type Answer = {
  id: number;
  text: string;
};

export class QuestionResponseDto {
  id: number;
  lesson_id: number;
  question_text: string;
  answers: Answer[];
  correct_answer_id: number;
  created_at: Date;
  updated_at: Date;

  constructor(question: Question) {
    this.id = question.id;
    this.lesson_id = question.lesson?.id;
    this.question_text = question.question_text;
    this.answers = question.answers;
    this.correct_answer_id = question.correct_answer_id;
    this.created_at = question.created_at;
    this.updated_at = question.updated_at;
  }
}