import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key',
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'email', 'roles', 'created_at']
    });

    if (!user) {
      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục');
    }

    if (!user.enabled) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    return user;
  }
}