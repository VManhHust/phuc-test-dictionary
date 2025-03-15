import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Word} from '../entity/word.entity';
import {ILike, Repository} from 'typeorm';
import {CreateWordDto} from "../dto/create-word.dto";
import {UpdateWordDto} from "../dto/update-word.dto";
import {PaginationService} from "./pagination/pagination.service";

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
        private readonly paginationService: PaginationService
    ) {
    }

    async findWord(word: string): Promise<Word | null> {
        return await this.wordRepository.findOne({
            where: {word: ILike(word)},
            relations: ['definitions', 'etymologies', 'synonyms'],
        });
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