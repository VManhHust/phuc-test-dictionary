import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { EtymologyService } from '../service/etymology.service';
import { Etymology } from '../entity/etymology.entity';

@Controller('etymology')
export class EtymologyController {
  constructor(private readonly etymologyService: EtymologyService) {
  }

  @Get('/find-etymology')
  async findEtymology(@Query('word') word: string): Promise<Etymology[]> {
    if (!word) {
      throw new NotFoundException('Bạn cần nhập một từ để tìm nguyên học của nó.');
    }
    return this.etymologyService.findEtymology(word);
  }
}