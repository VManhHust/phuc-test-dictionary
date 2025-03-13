import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import { SynonymService } from '../service/synonym.service';
import { Synonym } from '../entity/synonym.entity';
import {UpdateSynonymDto} from "../dto/update-synonym.dto";
import {CreateSynonymDto} from "../dto/create-synonym.dto";

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

  @Post()
  async createSynonym(@Body() createSynonymDto: CreateSynonymDto): Promise<Synonym> {
    return this.synonymService.create(createSynonymDto);
  }


  @Put(':id')
  async updateSynonym(
      @Param('id') id: string,
      @Body() updateSynonymDto: UpdateSynonymDto,
  ): Promise<Synonym> {
    return this.synonymService.update(id, updateSynonymDto);
  }


  @Delete(':id')
  async deleteSynonym(@Param('id') id: string): Promise<void> {
    return this.synonymService.delete(id);
  }
}