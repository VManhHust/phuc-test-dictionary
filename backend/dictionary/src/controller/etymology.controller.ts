import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import {EtymologyService} from '../service/etymology.service';
import {Etymology} from '../entity/etymology.entity';
import {CreateEtymologyDto} from "../dto/create-etymology.dto";
import {UpdateEtymologyDto} from "../dto/update-etymology.dto";

@Controller('etymology')
export class EtymologyController {
    constructor(private readonly etymologyService: EtymologyService) {
    }

    @Get('/find-etymology')
    async findEtymology(
        @Query('skip') skip?: number,
        @Query('take') take?: number,
        @Query('word') word?: string
    ){
        if (!word) {
            throw new NotFoundException('Bạn cần nhập một từ để tìm nguyên học của nó.');
        }
        return await this.etymologyService.search(word, Number(skip), Number(take));
    }

    @Post()
    async createEtymology(@Body() createEtymologyDto: CreateEtymologyDto): Promise<Etymology> {
        return this.etymologyService.create(createEtymologyDto);
    }


    @Put(':id')
    async updateEtymology(
        @Param('id') id: string,
        @Body() updateEtymologyDto: UpdateEtymologyDto,
    ): Promise<Etymology> {
        return this.etymologyService.update(id, updateEtymologyDto);
    }


    @Delete(':id')
    async deleteEtymology(@Param('id') id: string): Promise<void> {
        return this.etymologyService.delete(id);
    }
}