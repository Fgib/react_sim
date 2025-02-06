import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faulty } from '../entities/faulty.entity';

export class FaultyRepository {
  constructor(
    @InjectRepository(Faulty)
    private readonly errorRepository: Repository<Faulty>,
  ) { }

  async createError(errorData: Partial<Faulty>): Promise<Faulty> {
    const error = this.errorRepository.create(errorData);
    return await this.errorRepository.save(error);
  }

  async findAll(): Promise<Faulty[]> {
    return await this.errorRepository.find();
  }

  async findById(id: string): Promise<Faulty> {
    return await this.errorRepository.findOne({
      where: { id }
    });
  }

  async updateError(id: string, errorData: Partial<Faulty>): Promise<Faulty> {
    await this.errorRepository.update(id, errorData);
    return await this.findById(id);
  }

  async deleteError(id: string): Promise<void> {
    await this.errorRepository.delete(id);
  }
}
