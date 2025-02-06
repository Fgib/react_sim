import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doc, Status } from '../entities/doc.entity';

export class DocRepository {
  constructor(
    @InjectRepository(Doc)
    private readonly docRepository: Repository<Doc>,
  ) { }

  async createFile(fileData: Partial<Doc>): Promise<Doc> {
    const file = this.docRepository.create(fileData);
    return await this.docRepository.save(file);
  }

  async findAll(): Promise<Doc[]> {
    return await this.docRepository.find({
      relations: ['errors']
    });
  }

  async findById(id: string): Promise<Doc> {
    return await this.docRepository.findOne({
      where: { id }
    });
  }

  async updateStatus(id: string, status: Status): Promise<Doc> {
    await this.docRepository.update(id, { status });
    return await this.findById(id);
  }

  async updateFile(id: string, fileData: Partial<Doc>): Promise<Doc> {
    await this.docRepository.update(id, fileData);
    return await this.findById(id);
  }

  async deleteFile(id: string): Promise<void> {
    await this.docRepository.delete(id);
  }
}
