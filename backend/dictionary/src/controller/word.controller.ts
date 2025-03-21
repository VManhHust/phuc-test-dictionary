import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import { WordService } from '../service/word.service';
import { Word } from '../entity/word.entity';
import {CreateWordDto} from "../dto/create-word.dto";
import {UpdateWordDto} from "../dto/update-word.dto";
import {Roles} from "../auth/decorators/roles.decorator";

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}
  @Get('/find-word')
  async findWord(@Query('word') word: string): Promise<Word> {
    const result = await this.wordService.findWord(word);
    console.log('Received word:', word); // Debug để kiểm tra đầu vào
    if (!result) {
      throw new NotFoundException(`Từ "${word}" không tìm thấy trong từ điển`);
    }
    return result;
  }
  @Post()
  @Roles('ADMIN')
  async create(@Body() createWordDto: CreateWordDto) {
    return this.wordService.create(createWordDto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
    return this.wordService.update(id, updateWordDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.wordService.remove(id);
  }

  @Get()
  async search(
      @Query('word') word: string,
      @Query('page') skip?: number,
      @Query('size') take?: number,
      @Query('fetchCounts') fetchCounts?: string, // Thêm query param fetchCounts
  ) {
    return await this.wordService.search(
        word,
        Number(skip),
        Number(take),
        fetchCounts === 'true'
    );
  }

}