import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({where: { username }, select: ['id', 'username', 'password', 'email', 'isAdmin', 'createdAt', 'updatedAt']});
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);

    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
      isAdmin: data.isAdmin ?? true,
    });

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}