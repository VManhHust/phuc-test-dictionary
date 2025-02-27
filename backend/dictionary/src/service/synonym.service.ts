import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Synonym } from '../entity/synonym.entity';
import { Word } from '../entity/word.entity';

@Injectable()
export class SynonymService {
  constructor(
    @InjectRepository(Synonym)
    private readonly synonymRepository: Repository<Synonym>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {
  }

  async findSynonym(word: string): Promise<Synonym[]> {
    const wordEntity = await this.wordRepository.findOne({
      where: { word: ILike(word) },
    });

    if (!wordEntity) {
      throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
    }

    const synonyms = await this.synonymRepository
      .createQueryBuilder('synonym')
      .innerJoinAndSelect('synonym.word', 'word')
      .where('word.id = :wordId', { wordId: wordEntity.id })
      .getMany();
    return synonyms;
  }
}