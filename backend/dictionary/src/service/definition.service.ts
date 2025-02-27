import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Definition } from '../entity/definition.entity';
import { ILike, Repository } from 'typeorm';
import { Word } from '../entity/word.entity';

@Injectable()
export class DefinitionService {
  constructor(
    @InjectRepository(Definition)
    private readonly definitionRepository: Repository<Definition>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {
  }

  async findDefinition(word: string): Promise<Definition[]> {
    const wordEntity = await this.wordRepository.findOne({
      where: { word: ILike(word) },
    });

    if (!wordEntity) {
      throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
    }

    const definitions = await this.definitionRepository
      .createQueryBuilder('definition')
      .innerJoinAndSelect('definition.word', 'word')
      .where('word.id = :wordId', { wordId: wordEntity.id })
      .getMany();
    return definitions;
  }
}