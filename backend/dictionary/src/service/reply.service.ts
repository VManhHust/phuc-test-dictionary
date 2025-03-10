import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Reply} from "../entity/reply.entity";
import {Repository} from "typeorm";
import {CreateReplyDto} from "../dto/create-reply.dto";
import {Comment} from "../entity/comment.entity";

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(Reply)
        private readonly replyRepository: Repository<Reply>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {
    }

    async addReply(createReplyDto: CreateReplyDto): Promise<Reply> {
        const {commentId, userId, content} = createReplyDto;

        const comment = await this.commentRepository.findOne({where: {id: commentId}});
        if (!comment) {
            throw new NotFoundException(`Comment "${commentId}" không tồn tại.`);
        }

        const reply = new Reply();
        reply.comment = comment;
        reply.user_id = userId;
        reply.content = content;

        return await this.replyRepository.save(reply);
    }
}