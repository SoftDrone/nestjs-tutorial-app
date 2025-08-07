import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { QuestionResponseDto } from './dto/question-response.dto'; 

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const lesson = await this.lessonsRepository.findOneBy({
      id: createQuestionDto.lesson_id,
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${createQuestionDto.lesson_id} not found`);
    }

    const question = this.questionsRepository.create({
      question_text: createQuestionDto.question_text,
      answers: createQuestionDto.answers,
      correct_answer_id: createQuestionDto.correct_answer_id,
      lesson: lesson,
    });

    return await this.questionsRepository.save(question);
  }

  async findAll(): Promise<QuestionResponseDto[]> {
    const questions = await this.questionsRepository.find({ relations: ['lesson'] });

    return questions.map(question => new QuestionResponseDto(question));
  }

  async findOne(id: number): Promise<QuestionResponseDto> {
    const question = await this.questionsRepository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return new QuestionResponseDto(question);
  }
  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: number) {
    await this.questionsRepository.delete(id);
  }
}
