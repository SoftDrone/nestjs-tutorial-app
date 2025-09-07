import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { UserAnswer } from './user-answer.entity';

@Entity()
export class UserLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userLessons)
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.userLessons)
  lesson: Lesson;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'boolean', default: false })
  passed: boolean;

  @OneToMany(() => UserAnswer, (answer) => answer.userLesson, { cascade: true })
  answers: UserAnswer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
