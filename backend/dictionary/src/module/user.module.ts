import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {User} from "../entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [TypeOrmModule],
})
export class UserModule {
}