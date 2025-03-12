import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import { WordService } from '../service/word.service';
import { Word } from '../entity/word.entity';
import {CreateWordDto} from "../dto/create-word.dto";
import {UpdateWordDto} from "../dto/update-word.dto";

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
}