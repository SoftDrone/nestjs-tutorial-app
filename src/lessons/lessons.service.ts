import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Repository, In } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from '../units/entities/unit.entity';
import { LessonResponseDto } from './dto/lesson-reponse.dto'; 
import { UserLesson } from '../results/entities/user-lesson.entity'

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,

    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,

    @InjectRepository(UserLesson)
    private userLessonRepository: Repository<UserLesson>,
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

  async getLessonsForUser(unitId: number, userId: number) {
    // 1️⃣ Fetch all lessons for this unit
    const lessons = await this.lessonsRepository.find({
      where: { unit: { id: unitId } },
      order: { index: 'ASC' },
    });

    // 2️⃣ Fetch all UserLesson records for this user for these lessons
    const userLessons = await this.userLessonRepository.find({
      where: { user: { id: userId }, lesson: { id: In(lessons.map(l => l.id)) } },
      relations: ['lesson'],
      select: ['passed'], 
    });
    const passedLessonIds = new Set(userLessons.filter(ul => ul.passed).map(ul => ul.lesson.id));

    // 3️⃣ Compute canView for each lesson
    const lessonsWithAccess = lessons.map((lesson, idx) => {
      let canView = true;
      if (idx > 0) {
        const prevLesson = lessons[idx - 1];
        canView = passedLessonIds.has(prevLesson.id);
      }
      return { ...lesson, canView };
    });

    return lessonsWithAccess;
  }

  async findAll(unitId?: number): Promise<LessonResponseDto[]> {
    const query = this.lessonsRepository.createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.unit', 'unit');

    if (unitId) {
      query.where('unit.id = :unitId', { unitId });
    }

    const lessons = await query.getMany();
    return lessons.map(lesson => new LessonResponseDto(lesson));
  }

  async findOne(id: number): Promise<LessonResponseDto> {
    const lesson = await this.lessonsRepository.findOneBy({ id });
    if(!lesson) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }
    return new LessonResponseDto(lesson);
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lesson`;
  }

  async remove(id: number) {
    await this.lessonsRepository.delete(id);
  }
}
