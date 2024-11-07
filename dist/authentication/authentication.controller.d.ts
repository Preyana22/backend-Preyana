import { AuthenticationService } from "./authentication.service";
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import { User } from "../users/user.schema";
import { EmailService } from "src/users/email.service";
import UsersService from "src/users/users.service";
export declare class AuthenticationController {
    private readonly authenticationService;
    private readonly emailService;
    private readonly userService;
    constructor(authenticationService: AuthenticationService, emailService: EmailService, userService: UsersService);
    register(registrationData: RegisterDto): Promise<{
        message: string;
        user: import("../users/user.schema").UserDocument;
    }>;
    private generateRandomPassword;
    logIn(request: RequestWithUser): Promise<import("../users/user.schema").UserDocument>;
    logOut(request: RequestWithUser): Promise<void>;
    authenticate(request: RequestWithUser): import("../users/user.schema").UserDocument;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getUserById(id: string): Promise<import("../users/user.schema").UserDocument>;
    updateUser(id: string, updateUserDto: RegisterDto): Promise<{
        message: string;
        user: User | null;
    }>;
    checkEmail(email: string): Promise<{
        exists: boolean;
    }>;
}
