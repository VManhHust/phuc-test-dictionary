import {PartialType} from "@nestjs/mapped-types";
import {CreateEtymologyDto} from "./create-etymology.dto";

export class UpdateEtymologyDto extends PartialType(CreateEtymologyDto) {
}