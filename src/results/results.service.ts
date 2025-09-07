import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserLesson } from './entities/user-lesson.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../questions/entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { PaginationResponseDto } from '../global-dto/pagination-response.dto'
import { UserLessonDto } from './dto/user-lesson.dto'

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(UserLesson)
    private readonly userLessonRepo: Repository<UserLesson>,

    @InjectRepository(UserAnswer)
    private readonly userAnswerRepo: Repository<UserAnswer>,

    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,

    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateResultDto, userId: number) {
    // 1. Get all question IDs from the request
    const questionIds = Object.keys(dto.answers).map((id) => +id);

    // 2. Fetch all questions with their lesson
    const questions = await this.questionRepo.find({
      where: { id: In(questionIds) },
      relations: ['lesson'],
    });

    if (questions.length === 0) {
      throw new Error('No valid questions found');
    }

    let correctCount = 0;

    // 3. Create and save the UserLesson first
    const userLesson = this.userLessonRepo.create({
      user: { id: userId },
      lesson: { id: dto.lessonId },
      score: 0, // temp, will update later
      passed: false, // temp
    });
    await this.userLessonRepo.save(userLesson);

    // 4. Save user answers
    for (const [questionId, selectedAnswerId] of Object.entries(dto.answers)) {
      const question = questions.find((q) => q.id === +questionId);
      if (!question) continue;

      // check if answer is correct
      const selectedAnswer = await this.answerRepo.findOne({
        where: { id: selectedAnswerId as number },
      });
      if (!selectedAnswer) continue;

      const isCorrect = selectedAnswer.is_correct;
      if (isCorrect) correctCount++;

      // Save user answer linked to this UserLesson
      const userAnswer = this.userAnswerRepo.create({
        question: { id: +questionId } as Question,
        selected_answer_id: +selectedAnswerId,
        is_correct: isCorrect,
        userLesson,
      });

      await this.userAnswerRepo.save(userAnswer);
    }

    // 5. Calculate score + passed
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    // 7. Update userLesson with score and passed
    userLesson.score = score;
    userLesson.passed = passed;
    await this.userLessonRepo.save(userLesson);

    return {
      score,
      passed,
      total: questions.length,
      correct: correctCount,
    };
  }

  async createFromMistakes(dto: {answers: Record<string, number>})  {
    for (const [questionId, selectedAnswerId] of Object.entries(dto.answers)) {
      const selectedAnswer = await this.answerRepo.findOne({
        where: { id: selectedAnswerId as number },
      });
      const userAnswer = this.userAnswerRepo.create({
        question: { id: +questionId } as Question,
        selected_answer_id: +selectedAnswerId,
        is_correct: selectedAnswer?.is_correct,
      });

      await this.userAnswerRepo.save(userAnswer);
    }
    return {status: "OK!"};
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResponseDto<UserLesson>> {
    const [data, total] = await this.userLessonRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC', // optional: order by creation date
      },
      relations: ['lesson', 'lesson.unit'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<UserLesson> {
    const userLesson = await this.userLessonRepo.findOne({
      where: { id },
      relations: ['user', 'lesson', 'answers', 'answers.question', 'answers.question.answers'], // include answers and related questions
    });

    if (!userLesson) {
      throw new Error(`UserLesson with id ${id} not found`);
    }

    return userLesson;
  }

  update(id: number, updateResultDto: UpdateResultDto) {
    return `This action updates a #${id} result`;
  }

  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
