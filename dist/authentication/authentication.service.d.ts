import RegisterDto from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import UsersService from "../users/users.service";
import { EmailService } from "src/users/email.service";
import { MailerService } from "@nestjs-modules/mailer";
import { UserDocument } from "src/users/user.schema";
import { Model } from "mongoose";
export declare class AuthenticationService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    private readonly mailerService;
    private userModel;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailService: EmailService, mailerService: MailerService, userModel: Model<UserDocument>);
    register(registrationData: RegisterDto): Promise<{
        message: string;
        user: UserDocument;
    }>;
    getCookieWithJwtToken(userId: string): string;
    getCookieForLogOut(): string;
    getAuthenticatedUser(email: string, plainTextPassword: string): Promise<UserDocument>;
    private verifyPassword;
    private generateTemporaryPassword;
    requestPasswordReset(email: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    checkEmailExists(email: string): Promise<boolean>;
}
