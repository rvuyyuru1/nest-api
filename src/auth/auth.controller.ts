import { Controller, Post, Body, Patch, Next, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDTO, ResetPasswordDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}
  /**
   * create user
   */
  @Post('/signup')
  createUser(
    @Body() createUserDTO: CreateUserDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this._auth.createUser(createUserDTO, res, next);
  }

  /**
   * create login
   */
  @Post('/login')
  createsign(
    @Body() body: LoginDTO,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this._auth.createsign(body, res, next);
  }
  /**
   * reset password
   */
  @Patch('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO, @Next() next: NextFunction) {
    return this._auth.resetpassword(body, next);
  }
}
