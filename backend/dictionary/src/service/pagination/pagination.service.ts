import {Injectable} from '@nestjs/common';
import {FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository} from 'typeorm';

@Injectable()
export class PaginationService {
    async paginate<E extends ObjectLiteral>(
        repository: Repository<E>,
        query: { skip?: number; take?: number; where?: FindOptionsWhere<E> },
        relations?: string[],
    ) {
        const {skip, take, where} = query;
        const limit = take || 10;
        const currentPage = skip || 1;

        const options: FindManyOptions<E> = {
            take: limit,
            skip: (currentPage - 1) * limit,
            relations,
            where,
        };

        const [data, total] = await repository.findAndCount(options);

        return {
            data: data,
            total,
            total_pages: Math.ceil(total / limit),
            current_page: currentPage,
            limit,
        };

    }
}
