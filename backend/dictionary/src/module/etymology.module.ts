import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Etymology} from '../entity/etymology.entity';
import {EtymologyController} from '../controller/etymology.controller';
import {EtymologyService} from '../service/etymology.service';
import {Word} from '../entity/word.entity';
import {PaginationModule} from "./pagination.module";

@Module({
    imports: [TypeOrmModule.forFeature([Etymology, Word]),
        PaginationModule],
    controllers: [EtymologyController],
    providers: [EtymologyService]
})
export class EtymologyModule {
}