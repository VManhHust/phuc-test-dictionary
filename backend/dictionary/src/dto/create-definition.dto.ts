import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDefinitionDto {
    @IsNotEmpty()
    @IsString()
    wordId: string;

    @IsString()
    dictionary_name: string;

    @IsString()
    definition: string;

    @IsString()
    example: string;

}