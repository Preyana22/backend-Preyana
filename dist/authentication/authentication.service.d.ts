import RegisterDto from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import UsersService from "../users/users.service";
import { EmailService } from "src/users/email.service";
export declare class AuthenticationService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(registrationData: RegisterDto): Promise<{
        message: string;
        user: import("../users/user.schema").UserDocument;
    }>;
    getCookieWithJwtToken(userId: string): string;
    getCookieForLogOut(): string;
    getAuthenticatedUser(email: string, plainTextPassword: string): Promise<import("../users/user.schema").UserDocument>;
    private verifyPassword;
    private generateTemporaryPassword;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
