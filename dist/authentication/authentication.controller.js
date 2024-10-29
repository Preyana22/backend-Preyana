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
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const register_dto_1 = require("./dto/register.dto");
const jwt_authentication_guard_1 = require("./jwt-authentication.guard");
const user_schema_1 = require("../users/user.schema");
const mongooseClassSerializer_interceptor_1 = require("../utils/mongooseClassSerializer.interceptor");
const email_service_1 = require("../users/email.service");
const users_service_1 = require("../users/users.service");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService, emailService, userService) {
        this.authenticationService = authenticationService;
        this.emailService = emailService;
        this.userService = userService;
    }
    async register(registrationData) {
        let password = registrationData.password;
        if (!password) {
            password = this.generateRandomPassword();
            console.log("Generated password:", password);
            try {
                await this.emailService.sendPasswordEmail(registrationData.email, password);
            }
            catch (error) {
                console.error("Error sending email:", error.message);
                throw new common_1.InternalServerErrorException("Failed to send password email. Please try again later.");
            }
        }
        try {
            return await this.authenticationService.register(Object.assign(Object.assign({}, registrationData), { password }));
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.status) === 400) {
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.response, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.InternalServerErrorException("Failed to register. Please try again later.");
        }
    }
    generateRandomPassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }
    async logIn(request) {
        var _a;
        console.log("request.body" + JSON.stringify(request.body));
        const user = request.body;
        const results = this.authenticationService.getAuthenticatedUser(request.body.email, request.body.password);
        console.log("cookies" + JSON.stringify(results));
        const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
        (_a = request.res) === null || _a === void 0 ? void 0 : _a.setHeader("Set-Cookie", cookie);
        return results;
    }
    async logOut(request) {
        var _a;
        (_a = request.res) === null || _a === void 0 ? void 0 : _a.setHeader("Set-Cookie", this.authenticationService.getCookieForLogOut());
    }
    authenticate(request) {
        return request.user;
    }
    async forgotPassword(email) {
        try {
            await this.authenticationService.requestPasswordReset(email);
            return {
                success: true,
                message: "A temporary password has been sent to your email.",
            };
        }
        catch (error) {
            console.error("Error in forgotPassword:", error.message);
            if (error.message === "User not found") {
                return {
                    success: false,
                    message: "No user found with the provided email address.",
                };
            }
            else if (error.message.includes("sending limit exceeded")) {
                return {
                    success: false,
                    message: "Daily email sending limit exceeded. Please try again later.",
                };
            }
            return {
                success: false,
                message: "Failed to process the password reset request. Please try again later.",
            };
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        await this.authenticationService.changePassword(userId, currentPassword, newPassword);
        return { message: "Password has been successfully changed." };
    }
    async getUserById(id) {
        try {
            const user = await this.userService.getById(id);
            return user;
        }
        catch (error) {
            throw new common_1.NotFoundException("User not found");
        }
    }
    async updateUser(id, updateUserDto) {
        console.log("updateUserDto", updateUserDto);
        try {
            const updatedUser = await this.userService.updateUser(id, updateUserDto);
            if (!updatedUser) {
                throw new Error("User not found or update failed.");
            }
            return { message: "User updated successfully!", user: updatedUser };
        }
        catch (error) {
            console.error("Error updating user:", error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || "An error occurred while updating the user.",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("log-in"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    (0, common_1.Post)("log-out"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logOut", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("change-password"),
    __param(0, (0, common_1.Body)("userId")),
    __param(1, (0, common_1.Body)("currentPassword")),
    __param(2, (0, common_1.Body)("newPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)("profile/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)("profileUpdate/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "updateUser", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)("authentication"),
    (0, common_1.UseInterceptors)((0, mongooseClassSerializer_interceptor_1.default)(user_schema_1.User)),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        email_service_1.EmailService,
        users_service_1.default])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map