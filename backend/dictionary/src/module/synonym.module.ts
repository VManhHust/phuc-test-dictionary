import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Synonym} from '../entity/synonym.entity';
import {SynonymController} from '../controller/synonym.controller';
import {SynonymService} from '../service/synonym.service';
import {Word} from '../entity/word.entity';
import {PaginationModule} from "./pagination.module";

@Module({
    imports: [TypeOrmModule.forFeature([Synonym, Word]),
        PaginationModule],
    controllers: [SynonymController],
    providers: [SynonymService],
})
export class SynonymModule {
}