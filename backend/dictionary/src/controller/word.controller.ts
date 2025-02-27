import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { WordService } from '../service/word.service';
import { Word } from '../entity/word.entity';

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}
  @Get('/find-word')
  async findWord(@Query('word') word: string): Promise<Word> {
    const result = await this.wordService.findWord(word);
    if (!result) {
      throw new NotFoundException(`Từ "${word}" không tìm thấy trong từ điển`);
    }
    return result;
  }
}