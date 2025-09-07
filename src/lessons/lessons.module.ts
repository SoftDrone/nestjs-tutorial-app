import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Unit } from '../units/entities/unit.entity';
import { UserLesson } from '../results/entities/user-lesson.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Unit, UserLesson]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
