import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import RegisterDto from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";
import MongoError from "../utils/mongoError.enum";
import UsersService from "../users/users.service";
import { EmailService } from "src/users/email.service";
import { MailerService } from "@nestjs-modules/mailer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/users/user.schema";
import { Model } from "mongoose";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      return await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error: any) {
      // Handle duplicate email error
      if ((error as any)?.code === MongoError.DuplicateKey) {
        throw new HttpException(
          "User with that email already exists",
          HttpStatus.BAD_REQUEST
        );
      }

      // Handle unexpected errors
      throw new HttpException(
        "Something went wrong during registration",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME"
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Method to generate a random password
  private generateTemporaryPassword(): string {
    // You can adjust the length and characters as needed
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  async requestPasswordReset(email: string): Promise<void> {
    // Find user by email
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a reset token (you can customize the expiry time)
    // Generate a reset token with 1-hour expiration
    const resetToken = this.jwtService.sign({ email }, { expiresIn: "1h" });

    // Send reset password email
    await this.mailerService.sendMail({
      to: email,
      subject: "Password Reset",
      template: "../templates/forgot-password", // Path to your email template
      context: {
        name: user.email,
        resetLink: `http://192.168.1.92:3001/reset?token=${resetToken}`,
      },
    });
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    try {
      // Verify token and extract email
      const { email } = this.jwtService.verify(token);
      const user = await this.usersService.getByEmail(email);

      if (!user) throw new Error("Invalid token");

      // Check if new password matches confirm password
      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match.");
      }

      // Hash the new password and update it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(email, hashedPassword);
    } catch (error: any) {
      throw new Error(error.message || "Invalid or expired token");
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.usersService.getById(userId);

    // Check if the current password matches (you might want to hash it and compare)

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (isMatch) {
      console.log("Password matches");
    } else {
      throw new Error("Incorrect current password");
    }

    console.log("user", user);

    // Update to the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Optionally, hash this temporary password before saving
    await this.usersService.updatePassword(user.email, user.password);
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }
}
