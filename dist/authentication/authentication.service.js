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
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoError_enum_1 = require("../utils/mongoError.enum");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../users/email.service");
const mailer_1 = require("@nestjs-modules/mailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/user.schema");
const mongoose_2 = require("mongoose");
let AuthenticationService = class AuthenticationService {
    constructor(usersService, jwtService, configService, emailService, mailerService, userModel) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.mailerService = mailerService;
        this.userModel = userModel;
    }
    async register(registrationData) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            return await this.usersService.create(Object.assign(Object.assign({}, registrationData), { password: hashedPassword }));
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.code) === mongoError_enum_1.default.DuplicateKey) {
                throw new common_1.HttpException("User with that email already exists", common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException("Something went wrong during registration", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getCookieWithJwtToken(userId) {
        const payload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get("JWT_EXPIRATION_TIME")}`;
    }
    getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
    async getAuthenticatedUser(email, plainTextPassword) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            return user;
        }
        catch (error) {
            throw new common_1.HttpException("Wrong credentials provided", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPassword(plainTextPassword, hashedPassword) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new common_1.HttpException("Wrong credentials provided", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    generateTemporaryPassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const resetToken = jwt.sign({ email }, "your_secret_key", {
            expiresIn: "1h",
        });
        await this.mailerService.sendMail({
            to: email,
            subject: "Password Reset",
            template: "../templates/forgot-password",
            context: {
                name: user.email,
                resetLink: `http://192.168.1.92:3001/reset`,
            },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersService.getById(userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (isMatch) {
            console.log("Password matches");
        }
        else {
            throw new Error("Incorrect current password");
        }
        console.log("user", user);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.usersService.updatePassword(user.email, user.password);
    }
    async checkEmailExists(email) {
        const user = await this.userModel.findOne({ email }).exec();
        return !!user;
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [users_service_1.default,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService,
        mailer_1.MailerService,
        mongoose_2.Model])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map