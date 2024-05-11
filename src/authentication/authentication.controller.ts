import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { User } from '../users/user.schema';
import MongooseClassSerializerInterceptor from '../utils/mongooseClassSerializer.interceptor';

@Controller('authentication')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }



  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
  console.log("request.body"+JSON.stringify(request.body));
    const user  = request.body;
    const results = this.authenticationService.getAuthenticatedUser(request.body.email,request.body.password );
    console.log("cookies"+JSON.stringify(results));
    const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
    request.res?.setHeader('Set-Cookie', cookie);
    return results;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res?.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }


  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
