import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import {DefinitionService} from '../service/definition.service';
import {Definition} from '../entity/definition.entity';
import {UpdateDefinitionDto} from "../dto/update-definition.dto";
import {CreateDefinitionDto} from "../dto/create-definition.dto";

@Controller('definitions')
export class DefinitionController {
    constructor(private readonly definitionService: DefinitionService) {
    }

    @Get('/find-definition')
    async findEtymology(@Query('word') word: string): Promise<Definition[]> {
        if (!word) {
            throw new NotFoundException('Bạn cần nhập một từ để tìm định nghĩa của nó.');
        }
        return this.definitionService.findDefinition(word);
    }

    // Tạo mới một định nghĩa
    @Post()
    async createDefinition(@Body() createDefinitionDto: CreateDefinitionDto): Promise<Definition> {
        return this.definitionService.create(createDefinitionDto);
    }

    // Cập nhật định nghĩa
    @Put(':id')
    async updateDefinition(
        @Param('id') id: string,
        @Body() updateDefinitionDto: UpdateDefinitionDto,
    ): Promise<Definition> {
        return this.definitionService.update(id, updateDefinitionDto);
    }

    // Xóa định nghĩa
    @Delete(':id')
    async deleteDefinition(@Param('id') id: string): Promise<void> {
        return this.definitionService.delete(id);
    }
}