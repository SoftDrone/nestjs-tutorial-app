import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany 
} from 'typeorm';
import { Unit } from '../../units/entities/unit.entity';
import { UserLesson } from '../../results/entities/user-lesson.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Unit, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @Column()
  name: string;

  @Column()
  index: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserLesson, userLesson => userLesson.lesson)
  userLessons: UserLesson[];
  
  @OneToMany(() => Question, (question) => question.lesson, { cascade: true })
  questions: Question[];
}
