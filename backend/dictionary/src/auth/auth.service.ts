import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UsersService } from '../service/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }
    
    if (!user.enabled) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      id: user.id, 
      email: user.email, 
      roles: user.roles 
    };
    
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, email: string, password: string) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(
      password, 
      Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10))
    );
    
    // Tạo người dùng mới
    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: 'USER',
      enabled: true,
    });
    
    const savedUser = await this.usersRepository.save(newUser);
    
    // Loại bỏ mật khẩu trước khi trả về
    const { password: _, ...result } = savedUser;
    
    // Tạo token JWT
    const payload = { 
      id: result.id, 
      email: result.email, 
      roles: result.roles 
    };
    
    return {
      user: result,
      token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      // Vẫn trả về thành công để tránh lộ thông tin người dùng
      return { success: true };
    }
    
    // Tạo token đặt lại mật khẩu
    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Hết hạn sau 1 giờ
    
    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await this.usersRepository.save(user);
    
    // Gửi email đặt lại mật khẩu
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    await this.mailService.sendResetPasswordEmail(user.email, user.username, resetUrl);
    
    return { success: true };
  }

  async verifyResetToken(token: string) {
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return { valid: false };
    }
    
    return { valid: true };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
    
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(
      password, 
      Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10))
    );
    
    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = '';
    // @ts-ignore
    user.resetPasswordExpires = null;
    await this.usersRepository.save(user);
    
    return { success: true };
  }

  async updateProfile(userId: string, username: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    
    user.username = username;
    const updatedUser = await this.usersRepository.save(user);
    
    const { password: _, ...result } = updatedUser;
    return { success: true, user: result };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }
    
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(
      newPassword, 
      Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10))
    );
    
    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    
    return { success: true };
  }

  async findOrCreateUserFromOAuth(profile: any, provider: 'google' | 'facebook') {
    const providerId = profile.id;
    const email = profile.emails && profile.emails[0].value;
    const username = profile.displayName || (email ? email.split('@')[0] : `user_${Date.now()}`);
    
    // Tìm người dùng theo providerId
    let user: User | null;
    
    if (provider === 'google') {
      user = await this.usersRepository.findOne({ where: { googleId: providerId } });
    } else {
      user = await this.usersRepository.findOne({ where: { facebookId: providerId } });
    }
    
    if (user) {
      return user;
    }
    
    // Nếu không tìm thấy, kiểm tra theo email
    if (email) {
      user = await this.usersRepository.findOne({ where: { email } });
      
      if (user) {
        // Cập nhật providerId cho tài khoản hiện có
        if (provider === 'google') {
          user.googleId = providerId;
        } else {
          user.facebookId = providerId;
        }
        
        return await this.usersRepository.save(user);
      }
    }
    
    // Tạo người dùng mới
    const randomPassword = uuidv4();
    const hashedPassword = await bcrypt.hash(
      randomPassword, 
      Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10))
    );
    
    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: 'USER',
      enabled: true,
    });
    
    if (provider === 'google') {
      newUser.googleId = providerId;
    } else {
      newUser.facebookId = providerId;
    }
    
    return await this.usersRepository.save(newUser);
  }
}