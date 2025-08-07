import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Lesson])
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
