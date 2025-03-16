import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {Synonym} from '../entity/synonym.entity';
import {Word} from '../entity/word.entity';
import {CreateSynonymDto} from "../dto/create-synonym.dto";
import {UpdateSynonymDto} from "../dto/update-synonym.dto";
import {PaginationService} from "./pagination/pagination.service";

@Injectable()
export class SynonymService {
    constructor(
        @InjectRepository(Synonym)
        private readonly synonymRepository: Repository<Synonym>,
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
        private readonly paginationService: PaginationService
    ) {
    }

    async search(word: string | undefined, skip?: number, take?: number): Promise<any> {
        return await this.paginationService.paginate(
            this.synonymRepository,
            { skip, take, where: word ? { word: { id: word } } : {}, },
            ['word']
        );
    }

    async create(createSynonymDto: CreateSynonymDto): Promise<Synonym> {
        const {wordId, synonym_word} = createSynonymDto;

        const word = await this.wordRepository.findOne({where: {id: wordId}});
        if (!word) {
            throw new NotFoundException(`Từ với ID "${wordId}" không tìm thấy.`);
        }

        const save_synonym = new Synonym();
        save_synonym.word = word;
        save_synonym.synonym_word = synonym_word;

        return await this.synonymRepository.save(save_synonym);
    }

    async getById(id: string): Promise<Synonym> {
        const synonym = await this.synonymRepository.findOne({where: {id}, relations: ['word']});
        if (!synonym) {
            throw new NotFoundException(`Từ đồng nghĩa với ID "${id}" không tìm thấy.`);
        }
        return synonym;
    }


    async update(id: string, updateSynonymDto: UpdateSynonymDto): Promise<Synonym> {
        const synonym = await this.getById(id);
        Object.assign(synonym, updateSynonymDto);
        return await this.synonymRepository.save(synonym);
    }


    async delete(id: string): Promise<void> {
        const synonym = await this.getById(id);
        await this.synonymRepository.remove(synonym);
    }
    async getAllSynonyms(query: { skip?: number; take?: number }) {
        return await this.paginationService.paginate(this.synonymRepository, query);
    }
}