import {CreateDefinitionDto} from "./create-definition.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateDefinitionDto extends PartialType(CreateDefinitionDto) {}