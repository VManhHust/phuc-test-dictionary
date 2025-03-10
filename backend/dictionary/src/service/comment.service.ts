import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "../entity/post.entity";
import {User} from "../entity/user.entity";
import {CreateCommentDto} from "../dto/create-comment.dto";
import {Comment} from "../entity/comment.entity";
import {Reply} from "../entity/reply.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Reply)
        private readonly replyRepository: Repository<Reply>,
    ) {
    }

    async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const {postId, userId, content} = createCommentDto;
        const post = await this.postRepository.findOne({where: {id: postId}});
        if (!post) {
            throw new NotFoundException(`Bài viết "${postId}" không tồn tại.`);
        }

        const user = await this.userRepository.findOne({where: {id: userId}});
        if (!user) {
            throw new NotFoundException(`Người dùng "${userId}" không tồn tại.`);
        }

        const comment = new Comment();
        comment.post = post;
        comment.user_id = userId;
        comment.content = content;

        return await this.commentRepository.save(comment);
    }
}