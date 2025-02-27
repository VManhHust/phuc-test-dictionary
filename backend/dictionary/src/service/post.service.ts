import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PostEntity} from '../entity/post.entity';
import {Repository} from 'typeorm';
import {PaginationService} from './pagination/pagination.service';
import {CreatePostDto} from '../dto/create-post.dto';
import {User} from '../entity/user.entity';
import {UpdatePostDto} from '../dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly paginationService: PaginationService,
    ) {
    }

    async getAllPosts(query: { skip?: number; take?: number }) {
        return await this.paginationService.paginate(this.postRepository, query, ['author']);
    }

    async getPostById(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({
            where: {id},
            // relations: ['author', 'comments', 'comments.author'],
            relations: ['author', 'comments'],
        });
        if (!post) {
            throw new NotFoundException(`Bài viết không tồn tại.`);
        }
        return post;
    }

    async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
        const {title, content, userId} = createPostDto;
        const user = await this.userRepository.findOne({where: {id: userId}});
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        const post = this.postRepository.create({title, content, author: user});
        return this.postRepository.save(post);
    }

    async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
        const post = await this.postRepository.findOne({where: {id}});
        if (!post) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
        Object.assign(post, updatePostDto);
        return this.postRepository.save(post);
    }

    async deletePost(id: string): Promise<void> {
        const result = await this.postRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
    }

    async likePost(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({where: {id}});
        if (!post) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
        post.like_counts += 1;
        return this.postRepository.save(post);
    }

    async dislikePost(id: string): Promise<PostEntity> {
        const post = await this.postRepository.findOne({where: {id}});
        if (!post) {
            throw new NotFoundException('Không tìm thấy bài viết');
        }
        post.dislike_counts += 1;
        return this.postRepository.save(post);
    }
}