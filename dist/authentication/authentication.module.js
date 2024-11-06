"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const users_module_1 = require("../users/users.module");
const authentication_controller_1 = require("./authentication.controller");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./local.strategy");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./jwt.strategy");
const email_service_1 = require("../users/email.service");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path = require("path");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: `${configService.get("JWT_EXPIRATION_TIME")}s`,
                    },
                }),
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: "email-smtp.us-east-2.amazonaws.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "AKIAZR7XQOHLCFM35Q65",
                        pass: "BMIVwk4atHlHo+QYzxMdaInDXn2FKT9hOYqN3OGdTCbI",
                    },
                },
                defaults: {
                    from: "authentz-no-reply@xtensible.in",
                },
                template: {
                    dir: path.join(process.cwd(), "src", "templates"),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        ],
        providers: [authentication_service_1.AuthenticationService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, email_service_1.EmailService],
        controllers: [authentication_controller_1.AuthenticationController],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map