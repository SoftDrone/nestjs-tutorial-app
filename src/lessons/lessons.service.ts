import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from '../units/entities/unit.entity';
import { LessonResponseDto } from './dto/lesson-reponse.dto'; 

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,

    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    // Find the related Unit first
    const unit = await this.unitsRepository.findOneBy({ id: createLessonDto.unit_id });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${createLessonDto.unit_id} not found`);
    }

    const lesson = this.lessonsRepository.create({
      name: createLessonDto.name,
      index: createLessonDto.index,
      unit: unit,
    });

    return this.lessonsRepository.save(lesson);
  }

  async findAll(): Promise<LessonResponseDto[]> {
    const lessons = await this.lessonsRepository.find({ relations: ['unit'] });

    return lessons.map(lesson => new LessonResponseDto(lesson));
  }

  async findOne(id: number) {
    return this.lessonsRepository.findOneBy({ id });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  async remove(id: number) {
    await this.lessonsRepository.delete(id);
  }
}
