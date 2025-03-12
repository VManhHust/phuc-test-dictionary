import {CreateWordDto} from "./create-word.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWordDto extends PartialType(CreateWordDto) {}