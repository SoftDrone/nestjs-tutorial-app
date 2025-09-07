import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { UserLesson } from './entities/user-lesson.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../questions/entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLesson, UserAnswer, Question, Answer, User]),
    JwtModule
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}