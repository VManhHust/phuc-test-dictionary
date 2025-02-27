import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostEntity} from '../entity/post.entity';
import {PostController} from '../controller/post.controller';
import {PostService} from '../service/post.service';
import {PaginationService} from '../service/pagination/pagination.service';
import {User} from "../entity/user.entity";
import {UserModule} from "./user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, User]),
        UserModule,
    ],
    controllers: [PostController],
    providers: [PostService, PaginationService],
    exports: [PostService],
})
export class PostModule {
}