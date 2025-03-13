import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {Etymology} from '../entity/etymology.entity';
import {Word} from '../entity/word.entity';
import {CreateEtymologyDto} from "../dto/create-etymology.dto";
import {UpdateEtymologyDto} from "../dto/update-etymology.dto";

@Injectable()
export class EtymologyService {
    constructor(
        @InjectRepository(Etymology)
        private readonly etymologyRepository: Repository<Etymology>,
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
    ) {
    }

    async findEtymology(word: string): Promise<Etymology[]> {
        const wordEntity = await this.wordRepository.findOne({
            where: {word: ILike(word)},
        });

        if (!wordEntity) {
            throw new NotFoundException(`Từ "${word}" không có trong từ điển.`);
        }
        const etymologies = await this.etymologyRepository
            .createQueryBuilder('etymology')
            .innerJoinAndSelect('etymology.word', 'word')
            .where('word.id = :wordId', {wordId: wordEntity.id})
            .getMany();
        return etymologies;
    }

    async create(createEtymologyDto: CreateEtymologyDto): Promise<Etymology> {
        const {wordId, origin} = createEtymologyDto;

        const word = await this.wordRepository.findOne({where: {id: wordId}});
        if (!word) {
            throw new NotFoundException(`Từ với ID "${wordId}" không tìm thấy.`);
        }

        const save_etymology = new Etymology();
        save_etymology.word = word;
        save_etymology.origin = origin;

        return await this.etymologyRepository.save(save_etymology);
    }

    async getById(id: string): Promise<Etymology> {
        const etymology = await this.etymologyRepository.findOne({where: {id}, relations: ['word']});
        if (!etymology) {
            throw new NotFoundException(`Nguồn gốc với ID "${id}" không tìm thấy.`);
        }
        return etymology;
    }


    async update(id: string, updateEtymologyDto: UpdateEtymologyDto): Promise<Etymology> {
        const etymology = await this.getById(id);
        Object.assign(etymology, updateEtymologyDto);
        return await this.etymologyRepository.save(etymology);
    }


    async delete(id: string): Promise<void> {
        const etymology = await this.getById(id);
        await this.etymologyRepository.remove(etymology);
    }
}