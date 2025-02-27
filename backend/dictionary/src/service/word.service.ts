import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from '../entity/word.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {
  }

  async findWord(word: string): Promise<Word | null> {
    return await this.wordRepository.findOne({
      where: { word: ILike(word) },
      relations: ['definitions', 'etymologies', 'synonyms'],
    });
  }
}