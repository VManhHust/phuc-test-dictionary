import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WordController} from '../controller/word.controller';
import {WordService} from '../service/word.service';
import {Word} from '../entity/word.entity';
import {PaginationModule} from "./pagination.module";


@Module({
    imports: [TypeOrmModule.forFeature([Word]),
        PaginationModule],
    controllers: [WordController],
    providers: [WordService],
})
export class WordModule {
}