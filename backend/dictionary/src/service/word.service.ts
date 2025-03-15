import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Word} from '../entity/word.entity';
import {ILike, Repository} from 'typeorm';
import {CreateWordDto} from "../dto/create-word.dto";
import {UpdateWordDto} from "../dto/update-word.dto";
import {PaginationService} from "./pagination/pagination.service";
import {Synonym} from "../entity/synonym.entity";
import {Definition} from "../entity/definition.entity";
import {Etymology} from "../entity/etymology.entity";

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
        @InjectRepository(Synonym)
        private readonly synonymRepository: Repository<Synonym>,
        @InjectRepository(Definition)
        private readonly definitionRepository: Repository<Definition>,
        @InjectRepository(Etymology)
        private readonly etymologyRepository: Repository<Etymology>,
        private readonly paginationService: PaginationService
    ) {
    }

    async findWord(word: string): Promise<any> {
        const wordEntity = await this.wordRepository.findOne({
            where: { word: ILike(word) },
            relations: ['definitions', 'etymologies', 'synonyms'],
        });

        if (!wordEntity) {
            throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
        }

        const definitionCount = await this.definitionRepository
            .createQueryBuilder('definition')
            .where('definition.wordId = :wordId', { wordId: wordEntity.id })
            .getCount();

        const etymologyCount = await this.etymologyRepository
            .createQueryBuilder('etymology')
            .where('etymology.wordId = :wordId', { wordId: wordEntity.id })
            .getCount();

        const synonymCount = await this.synonymRepository
            .createQueryBuilder('synonym')
            .where('synonym.wordId = :wordId', { wordId: wordEntity.id })
            .getCount();

        return {
            ...wordEntity,
            definition_count: definitionCount,
            etymology_count: etymologyCount,
            synonym_count: synonymCount,
        };
    }


    async create(createWordDto: CreateWordDto): Promise<Word> {
        const newWord = this.wordRepository.create(createWordDto);
        return await this.wordRepository.save(newWord);
    }

    async update(id: string, updateWordDto: UpdateWordDto): Promise<Word> {
        const word = await this.wordRepository.findOne({where: {id}});

        if (!word) {
            throw new NotFoundException(`Word "${id}" không tồn tại.`);
        }

        await this.wordRepository.update(id, updateWordDto);

        const updatedWord = await this.wordRepository.findOne({where: {id}});

        if (!updatedWord) {
            throw new NotFoundException(`Word "${id}" không tồn tại sau khi cập nhật.`);
        }

        return updatedWord;
    }


    async remove(id: string): Promise<void> {
        const word = await this.wordRepository.findOne({
            where: {id: id}
        });
        if (!word) {
            throw new NotFoundException(`Word "${id}" không tồn tại.`);
        }
        await this.wordRepository.remove(word);
    }

    async getAllWords(query: { skip?: number; take?: number }) {
        return await this.paginationService.paginate(this.wordRepository, query);
    }

}