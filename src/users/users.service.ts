import { Injectable, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationResponseDto } from '../global-dto/pagination-response.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResponseDto<CreateUserDto>> {
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC', // optional: order by creation date
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<User | null> {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException('Id must be a positive integer');
    }
    return this.usersRepository.findOneBy({ id });
  }

  async findForLogin(username: string): Promise<User | null> {
    if (typeof username !== 'string' || username.length < 3) {
      throw new BadRequestException('Username must be a string with at least 3 characters');
    }
    return this.usersRepository.findOne({where: { username }, select: ['id', 'username', 'password']});
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);

    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword
    });

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException('Id must be a positive integer');
    }
    await this.usersRepository.delete(id);
  }
}