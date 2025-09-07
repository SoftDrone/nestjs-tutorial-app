import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { UserLesson } from '../results/entities/user-lesson.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,

    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,

    @InjectRepository(UserLesson)
    private readonly userLessonRepo: Repository<UserLesson>,
  ) {}

  async create(data: CreateUnitDto) {
    const unit = this.unitsRepository.create({
      ...data,
    });

    return this.unitsRepository.save(unit);
  }

  async getAllUnitsForUser(userId: number) {
    const units = await this.unitsRepository.find({
      relations: ['lessons'],
      order: { index: 'ASC' }, // order units
    });
    const userLessons = await this.userLessonRepo.find({
      relations: ['lesson'],
      where: { user: { id: userId }, passed: true },
    });
    const highestIndex = Math.max(...userLessons.map(item => item.lesson.index));

    return {data: units, latest_lesson: highestIndex};
  }

  async findAll() {
    return this.unitsRepository.find();
  }

  async findOne(id: number) {
    return this.unitsRepository.findOneBy({ id });
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  async remove(id: number) {
    await this.unitsRepository.delete(id);
  }
}
