import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { DefinitionService } from '../service/definition.service';
import { Definition } from '../entity/definition.entity';

@Controller('definitions')
export class DefinitionController {
  constructor(private readonly definitionService: DefinitionService) {
  }

  @Get('/find-definition')
  async findEtymology(@Query('word') word: string): Promise<Definition[]> {
    if (!word) {
      throw new NotFoundException('Bạn cần nhập một từ để tìm định nghĩa của nó.');
    }
    return this.definitionService.findDefinition(word);
  }
}