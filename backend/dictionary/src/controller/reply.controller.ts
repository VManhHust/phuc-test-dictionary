import {Body, Controller, Post} from "@nestjs/common";
import {ReplyService} from "../service/reply.service";
import {CreateReplyDto} from "../dto/create-reply.dto";

@Controller('replies')
export class ReplyController {
    constructor(private readonly replyService: ReplyService) {
    }
    @Post('/reply')
    async addReply(@Body() createReplyDto: CreateReplyDto) {
        return this.replyService.addReply(createReplyDto);
    }
}