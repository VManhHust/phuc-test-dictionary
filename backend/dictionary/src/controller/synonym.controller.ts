import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { SynonymService } from '../service/synonym.service';
import { Synonym } from '../entity/synonym.entity';

@Controller('synonym')
export class SynonymController {
  constructor(private readonly synonymService: SynonymService) {
  }

  @Get('/find-synonym')
  async findSynonym(@Query('word') word: string): Promise<Synonym[]> {
    if (!word) {
      throw new NotFoundException('Bạn cần nhập một từ để tìm đồng nghĩa.');
    }

    return this.synonymService.findSynonym(word);
  }
}