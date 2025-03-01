import {Body, Controller, Post} from "@nestjs/common";
import {CommentService} from "../service/comment.service";
import {CreateCommentDto} from "../dto/create-comment.dto";

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {
    }

    @Post('/add')
    async addComment(@Body() createCommentDto: CreateCommentDto) {
        return this.commentService.addComment(createCommentDto);
    }
}