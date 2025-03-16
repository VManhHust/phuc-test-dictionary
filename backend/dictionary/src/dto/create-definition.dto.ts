import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDefinitionDto {
    @IsNotEmpty()
    @IsString()
    wordId: string;

    dictionary_name: string;

    @IsString()
    definition: string;

    @IsString()
    example: string;

}