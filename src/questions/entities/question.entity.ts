import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.questions, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column()
  question_text: string;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
