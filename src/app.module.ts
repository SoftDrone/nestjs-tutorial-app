import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Unit } from './units/entities/unit.entity';
import { Lesson } from './lessons/entities/lesson.entity';
import { Question } from './questions/entities/question.entity';
import { Answer } from './questions/entities/answer.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UnitsModule } from './units/units.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuestionsModule } from './questions/questions.module';
import { UserAnswer } from './results/entities/user-answer.entity';
import { UserLesson } from './results/entities/user-lesson.entity';
import { ResultsModule } from './results/results.module';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Unit, Lesson, Question, Answer, UserAnswer, UserLesson],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    UnitsModule,
    LessonsModule,
    QuestionsModule,
    ResultsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
