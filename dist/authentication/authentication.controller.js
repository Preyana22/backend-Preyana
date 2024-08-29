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
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async register(registrationData) {
        return this.authenticationService.register(registrationData);
    }
    async logIn(request) {
        var _a;
        console.log("request.bodyk" + JSON.stringify(request.body));
        const user = request.body;
        const results = this.authenticationService.getAuthenticatedUser(request.body.email, request.body.password);
        console.log("cookies" + JSON.stringify(results));
        const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
        (_a = request.res) === null || _a === void 0 ? void 0 : _a.setHeader('Set-Cookie', cookie);
        return results;
    }
    async logOut(request) {
        var _a;
        (_a = request.res) === null || _a === void 0 ? void 0 : _a.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    }
    authenticate(request) {
        return request.user;
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    common_1.Post('log-in'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
__decorate([
    common_1.UseGuards(jwt_authentication_guard_1.default),
    common_1.Post('log-out'),
    common_1.HttpCode(200),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logOut", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "authenticate", null);
AuthenticationController = __decorate([
    common_1.Controller('authentication'),
    common_1.UseInterceptors(mongooseClassSerializer_interceptor_1.default(user_schema_1.User)),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map