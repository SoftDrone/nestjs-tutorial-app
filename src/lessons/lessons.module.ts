import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Unit } from '../units/entities/unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Unit]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
