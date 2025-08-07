import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from '../../lessons/entities/lesson.entity';

type Answer = {
  id: number;
  text: string;
};

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column()
  question_text: string;

  @Column('json')
  answers: Answer[];

  @Column()
  correct_answer_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
