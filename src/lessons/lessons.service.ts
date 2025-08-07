import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async create(data: CreateLessonDto) {
    const lesson = this.lessonsRepository.create({
      ...data,
    });

    return this.lessonsRepository.save(lesson);
  }

  async findAll() {
    return this.lessonsRepository.find();
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
