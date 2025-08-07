import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitsRepository: Repository<Unit>,
  ) {}

  async create(data: CreateUnitDto) {
    const unit = this.unitsRepository.create({
      ...data,
    });

    return this.unitsRepository.save(unit);
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
