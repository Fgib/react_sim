import { Injectable } from '@nestjs/common';
import { DocRepository } from 'src/database/repositories/doc.repository';
import { FaultyRepository } from 'src/database/repositories/faulty.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly docRepo: DocRepository,
    private readonly errorRepo: FaultyRepository,
  ) {
  }

  async getFiles() {
    console.log('getFiles');
    const files = await this.docRepo.findAll();
    console.log('files', files);
    return files;
  }
}