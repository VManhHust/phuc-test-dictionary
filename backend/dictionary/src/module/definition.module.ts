import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Definition} from '../entity/definition.entity';
import {DefinitionController} from '../controller/definition.controller';
import {DefinitionService} from '../service/definition.service';
import {Word} from '../entity/word.entity';
import {PaginationModule} from "./pagination.module";

@Module({
    imports: [TypeOrmModule.forFeature([Definition, Word]),
        PaginationModule],
    controllers: [DefinitionController],
    providers: [DefinitionService]
})
export class DefinitionModule {
}