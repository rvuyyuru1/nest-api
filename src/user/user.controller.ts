import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt_auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getMe() {
    console.log('called me has access');
    return {};
  }
}
