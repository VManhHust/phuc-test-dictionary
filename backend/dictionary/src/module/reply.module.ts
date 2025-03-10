import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reply} from "../entity/reply.entity";
import {ReplyController} from "../controller/reply.controller";
import {ReplyService} from "../service/reply.service";
import {Comment} from "../entity/comment.entity";
import {CommentModule} from "./comment.module";

@Module({
    imports: [TypeOrmModule.forFeature([Reply, Comment]), CommentModule],
    controllers: [ReplyController],
    providers: [ReplyService],
    exports: [ReplyService]
})
export class ReplyModule {
}