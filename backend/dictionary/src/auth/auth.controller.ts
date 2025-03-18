import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Put, 
  UseGuards, 
  Req, 
  Res, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { 
  RegisterDto, 
  LoginDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  UpdateProfileDto, 
  ChangePasswordDto,
  VerifyTokenDto
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username, 
      registerDto.email, 
      registerDto.password
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      return { 
        statusCode: HttpStatus.UNAUTHORIZED, 
        message: 'Email hoặc mật khẩu không đúng' 
      };
    }
    
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user) {
    return user;
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(userId, updateProfileDto.username);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      userId, 
      changePasswordDto.currentPassword, 
      changePasswordDto.newPassword
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-reset-token')
  @HttpCode(HttpStatus.OK)
  verifyResetToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyResetToken(verifyTokenDto.token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token, 
      resetPasswordDto.password
    );
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Xử lý bởi GoogleAuthGuard
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { token } = await this.authService.login(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    // Xử lý bởi FacebookAuthGuard
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const { token } = await this.authService.login(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}