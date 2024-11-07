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
    const resetToken = jwt.sign({ email }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Send reset password email
    await this.mailerService.sendMail({
      to: email,
      subject: "Password Reset",
      template: "../templates/forgot-password", // Path to your email template
      context: {
        name: user.email,
        resetLink: `http://192.168.1.92:3001/reset`,
      },
    });
  }

  // async requestPasswordReset(email: string) {
  //   const user = await this.usersService.getByEmail(email);

  //   if (!user) {
  //     // Return or throw a specific error if the user is not found
  //     throw new Error("User not found");
  //   }

  //   // Generate the temporary password
  //   const tempPassword = this.generateTemporaryPassword();

  //   try {
  //     // Send email with the temporary password
  //     await this.emailService.sendResetMail(
  //       user.email,
  //       "Password Reset Request",
  //       `Your temporary password is: ${tempPassword}. Please use it to log in and reset your password.`
  //     );

  //     // If email sent successfully, hash and update the password in the DB
  //     const hashedPassword = await bcrypt.hash(tempPassword, 10);
  //     user.password = hashedPassword;

  //     // Update the password in the database
  //     await this.usersService.updatePassword(email, user.password);

  //     console.log(
  //       "Password reset email sent and password updated successfully."
  //     );

  //     // Return a success message or an appropriate response
  //     return {
  //       message: "Password reset email sent and password updated successfully.",
  //     };
  //   } catch (error: any) {
  //     console.error(
  //       "Error sending reset password email or updating password:",
  //       error
  //     );

  //     // Check if the error is related to sending the email
  //     if (error.response && error.response.includes("550-5.4.5")) {
  //       // Return or throw a specific error for email sending issues
  //       throw new Error(
  //         "Failed to send reset password email due to sending limit exceeded."
  //       );
  //     }

  //     // Generic error for other cases
  //     throw new Error(
  //       "Failed to send reset password email or update the password."
  //     );
  //   }
  // }

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
