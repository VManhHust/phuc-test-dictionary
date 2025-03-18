// import {Body, Controller, Param, Post, Put} from "@nestjs/common";
// import {UserService} from "../service/user.service";
// import {CreateUserDto} from "../dto/create-user.dto";
// import {User} from "../entity/user.entity";
// import {UpdateUserDto} from "../dto/update-user.dto";
//
// @Controller('users')
// export class UserController {
//     constructor(private readonly userService: UserService) {}
//
//     @Post('/register')
//     async register(@Body() createUserDto: CreateUserDto): Promise<User> {
//         return this.userService.createUser(createUserDto);
//     }
//     @Put('/:id')
//     async updateUser(
//         @Param('id') id: string,
//         @Body() updateUserDto: UpdateUserDto,
//     ): Promise<User> {
//         return this.userService.updateUser(id, updateUserDto);
//     }
// }