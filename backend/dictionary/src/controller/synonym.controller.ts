import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import { SynonymService } from '../service/synonym.service';
import { Synonym } from '../entity/synonym.entity';
import {UpdateSynonymDto} from "../dto/update-synonym.dto";
import {CreateSynonymDto} from "../dto/create-synonym.dto";

@Controller('synonyms')
export class SynonymController {
  constructor(private readonly synonymService: SynonymService) {
  }

  @Get()
  async findSynonym(
      @Query('page') skip?: number,
      @Query('size') take?: number,
      @Query('word') word?: string
  ){
    return await this.synonymService.search(word, Number(skip), Number(take));
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
  @Get('/all-synonyms')
  async getAllSynonyms(
      @Query('skip') skip?: number,
      @Query('take') take?: number,
  ) {
    return await this.synonymService.getAllSynonyms({ skip: Number(skip), take: Number(take) });
  }
}