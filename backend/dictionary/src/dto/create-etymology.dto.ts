import {IsNotEmpty, IsString} from "class-validator";

export class CreateEtymologyDto {
    @IsNotEmpty()
    @IsString()
    wordId: string;

    @IsString()
    origin: string;
}