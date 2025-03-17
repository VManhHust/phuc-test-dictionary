import {WordDto} from "./word.dto";

export class PaginatedWordDto {
    constructor(
        public data: WordDto[],
        public total: number,
        public total_pages: number,
        public current_page: number,
        public limit: number,
    ) {}
}