import RegisterDto from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import UsersService from '../users/users.service';
export declare class AuthenticationService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registrationData: RegisterDto): Promise<import("../users/user.schema").UserDocument>;
    getCookieWithJwtToken(userId: string): string;
    getCookieForLogOut(): string;
    getAuthenticatedUser(email: string, plainTextPassword: string): Promise<import("../users/user.schema").UserDocument>;
    private verifyPassword;
}
