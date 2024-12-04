"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const mongoose_3 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let UsersService = class UsersService {
    constructor(userModel, connection) {
        this.userModel = userModel;
        this.connection = connection;
    }
    async getByEmail(email) {
        const user = await this.userModel.findOne({ email }).populate({
            path: "users",
            populate: {
                path: "email",
            },
        });
        return user;
    }
    async getById(id) {
        const user = await this.userModel.findById(id).populate({
            path: "users",
            populate: {
                path: "email",
            },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        return user;
    }
    async create(userData) {
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
        return {
            message: "User created successfully",
            user: createdUser,
        };
    }
    async delete(userId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const user = await this.userModel
                .findByIdAndDelete(userId)
                .populate("posts")
                .session(session);
            if (!user) {
                throw new common_1.NotFoundException();
            }
            const posts = user.posts;
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async updatePassword(email, password) {
        try {
            const user = await this.getByEmail(email);
            if (!user) {
                return null;
            }
            return await this.userModel.updateOne({ _id: user._id }, { $set: { password: password } });
        }
        catch (error) {
            console.error("Error in updatePassword:", error);
            throw new Error("Failed to update user password.");
        }
    }
    async updateUser(id, updateUserDto) {
        const user = await this.getById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        Object.assign(user, updateUserDto);
        return this.update(id, user);
    }
    async update(id, updateBookingDto) {
        return this.userModel
            .findByIdAndUpdate(id, updateBookingDto, { new: true })
            .exec();
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_3.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose.Connection])
], UsersService);
exports.default = UsersService;
//# sourceMappingURL=users.service.js.map