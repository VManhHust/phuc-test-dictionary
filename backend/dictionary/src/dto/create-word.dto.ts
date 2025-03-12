import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateWordDto {
    @IsNotEmpty()
    @IsString()
    word: string;
    @IsOptional()
    @IsString()
    pronunciation: string;
}