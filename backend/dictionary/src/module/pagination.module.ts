import {PaginationService} from "../service/pagination/pagination.service";
import {Module} from "@nestjs/common";

@Module({
    providers: [PaginationService],
    exports: [PaginationService],
})
export class PaginationModule {
}