import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  InternalServerErrorException,
  Param,
  NotFoundException,
  Put,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import RegisterDto from "./dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import { User } from "../users/user.schema";
import MongooseClassSerializerInterceptor from "../utils/mongooseClassSerializer.interceptor";
import { EmailService } from "src/users/email.service";
import UsersService from "src/users/users.service";

@Controller("authentication")
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService
  ) {}

  @Post("register")
  async register(@Body() registrationData: RegisterDto) {
    // Check if the password field is empty
    let password = registrationData.password;

    if (!password) {
      // Generate a random password
      password = this.generateRandomPassword();
      console.log("password " + password);
      // Try to send the generated password to the user's email
      try {
        await this.emailService.sendPasswordEmail(
          registrationData.email,
          password
        );
      } catch (error: any) {
        console.error("Error sending email:", error.message);

        // Handle the email sending failure
        throw new InternalServerErrorException(
          "Failed to send password email. Please try again later."
        );
      }
    }

    // Proceed with the registration process if email was sent successfully
    try {
      return await this.authenticationService.register({
        ...registrationData,
        password,
      });
    } catch (error: any) {
      console.error("Error during registration:", error.message);
      throw new InternalServerErrorException(
        "Failed to register. Please try again later."
      );
    }
  }

  // Method to generate a random password
  private generateRandomPassword(): string {
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

  @Post("log-in")
  async logIn(@Req() request: RequestWithUser) {
    console.log("request.body" + JSON.stringify(request.body));
    const user = request.body;
    const results = this.authenticationService.getAuthenticatedUser(
      request.body.email,
      request.body.password
    );
    console.log("cookies" + JSON.stringify(results));
    const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
    request.res?.setHeader("Set-Cookie", cookie);
    return results;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("log-out")
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res?.setHeader(
      "Set-Cookie",
      this.authenticationService.getCookieForLogOut()
    );
  }

  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    try {
      // Attempt to send the reset password email
      await this.authenticationService.requestPasswordReset(email);

      // Return success response if no error occurs
      return {
        success: true,
        message: "A temporary password has been sent to your email.",
      };
    } catch (error: any) {
      console.error("Error in forgotPassword:", error.message);

      // Handle specific errors (e.g., user not found or email sending issue)
      if (error.message === "User not found") {
        return {
          success: false,
          message: "No user found with the provided email address.",
        };
      } else if (error.message.includes("sending limit exceeded")) {
        return {
          success: false,
          message:
            "Daily email sending limit exceeded. Please try again later.",
        };
      }

      // Return a generic error for any other unexpected issues
      return {
        success: false,
        message:
          "Failed to process the password reset request. Please try again later.",
      };
    }
  }

  @Post("change-password")
  async changePassword(
    @Body("userId") userId: string,
    @Body("currentPassword") currentPassword: string,
    @Body("newPassword") newPassword: string
  ) {
    await this.authenticationService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    return { message: "Password has been successfully changed." };
  }

  @Get("profile/:id")
  async getUserById(@Param("id") id: string) {
    try {
      const user = await this.userService.getById(id);
      return user;
    } catch (error) {
      throw new NotFoundException("User not found");
    }
  }

  // Update user endpoint
  @Put("profileUpdate/:id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: RegisterDto
  ): Promise<User | null> {
    console.log("updateUserDto", updateUserDto);
    return this.userService.updateUser(id, updateUserDto);
  }
}
