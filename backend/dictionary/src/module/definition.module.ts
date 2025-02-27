import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from '../entity/definition.entity';
import { DefinitionController } from '../controller/definition.controller';
import { DefinitionService } from '../service/definition.service';
import { Word } from '../entity/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Definition, Word])],
  controllers: [DefinitionController],
  providers: [DefinitionService]
})
export class DefinitionModule {}