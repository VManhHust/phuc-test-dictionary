import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {WordController} from '../controller/word.controller';
import {WordService} from '../service/word.service';
import {Word} from '../entity/word.entity';
import {PaginationModule} from "./pagination.module";
import {Definition} from "../entity/definition.entity";
import {Synonym} from "../entity/synonym.entity";
import {Etymology} from "../entity/etymology.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Word, Definition, Synonym, Etymology]),
        PaginationModule],
    controllers: [WordController],
    providers: [WordService],
})
export class WordModule {
}