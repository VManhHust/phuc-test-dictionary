import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Etymology } from '../entity/etymology.entity';
import { Word } from '../entity/word.entity';

@Injectable()
export class EtymologyService {
  constructor(
    @InjectRepository(Etymology)
    private readonly etymologyRepository: Repository<Etymology>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {
  }

  async findEtymology(word: string): Promise<Etymology[]> {
    const wordEntity = await this.wordRepository.findOne({
      where: { word: ILike(word) },
    });

    if (!wordEntity) {
      throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
    }
    const etymologies = await this.etymologyRepository
      .createQueryBuilder('etymology')
      .innerJoinAndSelect('etymology.word', 'word')
      .where('word.id = :wordId', {wordId: wordEntity.id})
      .getMany();
    return etymologies;
  }
}