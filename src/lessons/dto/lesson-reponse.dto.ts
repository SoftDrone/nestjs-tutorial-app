import { Lesson } from '../entities/lesson.entity';

export class LessonResponseDto {
  id: number;
  name: string;
  index: number;
  unit_id: number;
  created_at: Date;
  updated_at: Date;

  constructor(lesson: Lesson) {
    this.id = lesson.id;
    this.name = lesson.name;
    this.index = lesson.index;
    this.unit_id = lesson.unit?.id;
    this.created_at = lesson.created_at;
    this.updated_at = lesson.updated_at;
  }
}