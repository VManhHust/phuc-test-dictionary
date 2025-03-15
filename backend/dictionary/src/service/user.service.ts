import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entity/user.entity";
import {CreateUserDto} from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import {UpdateUserDto} from "../dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const {username, password, email, role} = createUserDto;

        const existingUser = await this.userRepository.findOne({where: {email}});
        if (existingUser) {
            throw new ConflictException('Email đã được sử dụng');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            email,
            role,
        });

        return await this.userRepository.save(newUser);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new NotFoundException(`User với id "${id}" không tồn tại.`);
        }

        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt(10);
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }

        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

}