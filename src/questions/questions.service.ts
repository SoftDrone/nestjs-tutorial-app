import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { QuestionResponseDto } from './dto/question-response.dto'; 
import { UserAnswer } from '../results/entities/user-answer.entity'

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,

    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    
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
      lesson: lesson,
    });

    return await this.questionsRepository.save(question);
  }

  async findAll(
    lessonId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: QuestionResponseDto[]; total: number; page: number; limit: number }> {
    const where = lessonId ? { lesson: { id: lessonId } } : {};

    const [questions, total] = await this.questionsRepository.findAndCount({
      relations: ['lesson', 'answers'], // include answers + lesson
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: questions.map((question) => new QuestionResponseDto(question)),
      total,
      page,
      limit,
    };
  }

  async getMyMistakes(userId: number): Promise<{ data: QuestionResponseDto[] }> {
    // Step 1: get the latest answer for each question for this user
    const latestAnswers = await this.userAnswerRepository
      .createQueryBuilder("ua")
      .innerJoin(
        qb =>
          qb
            .select("sub.questionId", "questionId")
            .addSelect("MAX(sub.created_at)", "maxCreatedAt")
            .from("user_answer", "sub")
            .groupBy("sub.questionId"),
        "latest",
        "latest.questionId = ua.questionId AND latest.maxCreatedAt = ua.created_at"
      )
      .leftJoinAndSelect("ua.question", "question")
      .leftJoinAndSelect("question.answers", "answers")
      .where("ua.is_correct = false")
      .getMany();

    // Step 2: map to questions
    const questions = latestAnswers.map(ua => ua.question);

    return { data: questions.map(q => new QuestionResponseDto(q)) };
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
