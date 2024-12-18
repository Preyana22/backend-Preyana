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
  HttpStatus,
  HttpException,
  Query,
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
import MongoError from "src/utils/mongoError.enum";

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
    const { email, google_id, facebook_id } = registrationData;

    // Generate a random password if the email does not exist
    let password = registrationData.password;
    // Check if the user already exists by email
    const user = await this.userService.getByEmail(email);

    if (user) {
      // Update the google_id if the user exists
      try {
        // Update Google ID if provided
        if (google_id) {
          user.google_id = google_id;
        }
        // Update Facebook ID if provided
        if (facebook_id) {
          user.facebook_id = facebook_id;
        }
        await this.userService.updateUser(user._id, user);

        if (!user) {
          throw new NotFoundException("User not found");
        }

        // Manually convert _id to a string
        user._id = user._id.toString(); // Convert _id to string before returning user details
        console.log("existingUser", user);

        return {
          message: "Google ID or Facebook ID updated for existing user",
          user: user, // Clean the user document before returning
        };
      } catch (error: any) {
        console.error("Error updating user:", error.message);
        throw new InternalServerErrorException(
          "Failed to update user. Please try again later."
        );
      }
    } else {
      if (!password) {
        password = this.generateRandomPassword();
        console.log("Generated password:", password);

        // Attempt to send the generated password to the user's email
        try {
          await this.emailService.sendPasswordEmail(email, password);
        } catch (error: any) {
          console.error("Error sending email:", error.message);

          // Handle email sending failure
          throw new InternalServerErrorException(
            "Failed to send password email. Please try again later."
          );
        }
      }
    }

    if (!user) {
      console.log("No existing user found, creating a new user.");
      // Create a new user with the provided data and generated password
      try {
        const newUser = await this.authenticationService.register({
          ...registrationData,
          password,
        });

        return {
          message: "User registered successfully",
          user: newUser, // Clean the new user document before returning
        };
      } catch (error: any) {
        // Handle other registration errors
        console.error("Registration error:", error.message);
        throw new InternalServerErrorException(
          "Failed to register. Please try again later."
        );
      }
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
        message: "A reset password link has been sent to your email.",
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
  ): Promise<{ message: string; user: User | null }> {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);

      // If no user was found or updated, you can return a specific message
      if (!updatedUser) {
        throw new Error("User not found or update failed.");
      }

      // Return a success message along with the updated user
      return { message: "User updated successfully!", user: updatedUser };
    } catch (error: any) {
      // Handle any errors that occur during the update process
      console.error("Error updating user:", error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || "An error occurred while updating the user.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("check-email")
  async checkEmail(@Query("email") email: string) {
    const emailExists = await this.authenticationService.checkEmailExists(
      email
    );
    return { exists: emailExists };
  }

  @Post("reset-password")
  async resetPassword(
    @Body("token") token: string,
    @Body("newPassword") newPassword: string,
    @Body("confirmPassword") confirmPassword: string
  ) {
    try {
      await this.authenticationService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      return { success: true, message: "Password reset successful" };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
