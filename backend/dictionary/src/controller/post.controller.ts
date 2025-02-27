import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostEntity } from '../entity/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Get('/all-posts')
  async getAllPosts(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return await this.postService.getAllPosts({ skip: Number(skip), take: Number(take) });
  }

  @Get('/get-post')
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  @Post('/save')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Put('/update/:id')
  async updatePost(
    @Param('id') id: string, @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete('/delete/:id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
  @Patch(':id/like')
  async likePost(@Param('id') id: string) {
    return this.postService.likePost(id);
  }

  @Patch(':id/dislike')
  async dislikePost(@Param('id') id: string) {
    return this.postService.dislikePost(id);
  }
}