import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {User} from './entity/user.entity';
import {Word} from './entity/word.entity';
import {Definition} from './entity/definition.entity';
import {Etymology} from './entity/etymology.entity';
import {Synonym} from './entity/synonym.entity';
import {Statistic} from './entity/statistic.entity';
import {Comment} from './entity/comment.entity';
import {PostEntity} from './entity/post.entity';
import {Reply} from './entity/reply.entity';
import {SearchLog} from './entity/search-log.entity';
import * as process from 'process';
import {WordModule} from './module/word.module';
import {SynonymModule} from './module/synonym.module';
import {EtymologyModule} from './module/etymology.module';
import {DefinitionModule} from './module/definition.module';
import {PostModule} from './module/post.module';
import {CommentModule} from "./module/comment.module";
import {ReplyModule} from "./module/reply.module";
import {Role} from "./entity/role.entity";
import {Permission} from "./entity/permission.entity";
import {Function} from "./entity/function.entity";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}), // Load biến môi trường từ .env
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                schema: configService.get<string>('DB_SCHEMA'),
                autoLoadEntities: true,
                // synchronize: process.env.NODE_ENV !== 'production', // Chỉ bật trong môi trường dev
                synchronize: true,
                extra: {
                    options: '-c timezone=Asia/Ho_Chi_Minh',
                },
            }),
        }),
        TypeOrmModule.forFeature([User, Word, Definition, Etymology, Synonym, Statistic, Comment, PostEntity, Reply, SearchLog, Role, Permission, Function]),
        WordModule,
        SynonymModule,
        EtymologyModule,
        DefinitionModule,
        PostModule,
        CommentModule,
        ReplyModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}