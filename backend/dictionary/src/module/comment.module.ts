import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentController} from "../controller/comment.controller";
import {CommentService} from "../service/comment.service";
import {PostEntity} from "../entity/post.entity";
import {Comment} from "../entity/comment.entity";
import {User} from "../entity/user.entity";
import {Reply} from "../entity/reply.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, PostEntity, User, Reply])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}