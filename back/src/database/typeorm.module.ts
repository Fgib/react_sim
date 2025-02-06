import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './entities/doc.entity';
import { Faulty } from './entities/faulty.entity';
import { DocRepository } from './repositories/doc.repository';
import { FaultyRepository } from './repositories/faulty.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Doc, Faulty])],
  providers: [DocRepository, FaultyRepository],
  exports: [DocRepository, FaultyRepository]
})
export class TypeOrmRepositoriesModule { }
