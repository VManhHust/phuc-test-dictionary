import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Definition} from '../entity/definition.entity';
import {ILike, Repository} from 'typeorm';
import {Word} from '../entity/word.entity';
import {UpdateDefinitionDto} from "../dto/update-definition.dto";
import {CreateDefinitionDto} from "../dto/create-definition.dto";
import {PaginationService} from "./pagination/pagination.service";

@Injectable()
export class DefinitionService {
    constructor(
        @InjectRepository(Definition)
        private readonly definitionRepository: Repository<Definition>,
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
        private readonly paginationService: PaginationService
    ) {
    }

    async search(word: string, skip?: number, take?: number): Promise<any> {
        const wordEntity = await this.wordRepository.findOne({
            where: {word: ILike(word)},
        });

        if (!wordEntity) {
            throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
        }

        return await this.paginationService.paginate(
            this.definitionRepository,
            { skip, take },
            ['word']
        );
    }

    // Tạo mới định nghĩa
    async create(createDefinitionDto: CreateDefinitionDto): Promise<Definition> {
        const {wordId, dictionary_name, definition, example} = createDefinitionDto;

        // Kiểm tra xem từ có tồn tại không
        const word = await this.wordRepository.findOne({where: {id: wordId}});
        if (!word) {
            throw new NotFoundException(`Từ với ID "${wordId}" không tìm thấy.`);
        }

        const save_definition = new Definition();
        save_definition.word = word;
        save_definition.dictionary_name = dictionary_name;
        save_definition.definition = definition;
        save_definition.example = example;

        return await this.definitionRepository.save(save_definition);
    }

    async getById(id: string): Promise<Definition> {
        const definition = await this.definitionRepository.findOne({where: {id}, relations: ['word']});
        if (!definition) {
            throw new NotFoundException(`Định nghĩa với ID "${id}" không tìm thấy.`);
        }
        return definition;
    }

    // Cập nhật định nghĩa
    async update(id: string, updateDefinitionDto: UpdateDefinitionDto): Promise<Definition> {
        const definition = await this.getById(id);
        Object.assign(definition, updateDefinitionDto);
        return await this.definitionRepository.save(definition);
    }

    // Xóa định nghĩa
    async delete(id: string): Promise<void> {
        const definition = await this.getById(id);
        await this.definitionRepository.remove(definition);
    }
}