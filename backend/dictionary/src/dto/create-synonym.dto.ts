import {IsNotEmpty, IsString} from "class-validator";

export class CreateSynonymDto {
    @IsNotEmpty()
    @IsString()
    wordId: string;

    @IsString()
    synonym_word: string;
}