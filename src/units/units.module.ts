import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { UserLesson } from '../results/entities/user-lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit, Lesson, UserLesson]),
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
