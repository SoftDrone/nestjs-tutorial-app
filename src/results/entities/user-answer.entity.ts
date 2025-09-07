import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserLesson } from './user-lesson.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => UserLesson, (userLesson) => userLesson.answers, { nullable: true })
  userLesson: UserLesson | null;

  @Column()
  selected_answer_id: number;

  @Column({ type: 'boolean' })
  is_correct: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
