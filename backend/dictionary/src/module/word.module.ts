import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordController } from '../controller/word.controller';
import { WordService } from '../service/word.service';
import { Word } from '../entity/word.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}