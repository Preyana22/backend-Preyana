import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument, User } from "./user.schema";
import CreateUserDto from "./dto/createUser.dto";
import * as bcrypt from "bcrypt";

import { InjectConnection } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import RegisterDto from "src/authentication/dto/register.dto";

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).populate({
      path: "users",
      populate: {
        path: "email",
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id).populate({
      path: "users",
      populate: {
        path: "email",
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);

    await createdUser
      .populate({
        path: "users",
        populate: {
          path: "email",
        },
      })
      .execPopulate();

    await createdUser.save();

    // Return a success message
    return {
      message: "User created successfully",
      user: createdUser, // Optionally return the created user data
    };
  }

  async delete(userId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel
        .findByIdAndDelete(userId)
        .populate("posts")
        .session(session);

      if (!user) {
        throw new NotFoundException();
      }
      const posts = user.posts;

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updatePassword(email: string, password: string) {
    try {
      const user = await this.getByEmail(email);

      if (!user) {
        return null; // user not found
      }

      // Update only the password field using `updateOne` or `findOneAndUpdate`
      return await this.userModel.updateOne(
        { _id: user._id }, // Match the user by ID or email
        { $set: { password: password } } // Set the new password
      );
    } catch (error) {
      // Log or handle error if ObjectId conversion fails or other errors occur
      console.error("Error in updatePassword:", error);
      throw new Error("Failed to update user password.");
    }
  }

  // Update user method
  async updateUser(
    id: string,
    updateUserDto: RegisterDto
  ): Promise<User | null> {
    const user = await this.getById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    return this.update(id, user);
  }

  async update(id: string, updateBookingDto: any): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
  }
}

export default UsersService;
