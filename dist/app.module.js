"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const flights_module_1 = require("./flights/flights.module");
const Joi = require("@hapi/joi");
const authentication_module_1 = require("./authentication/authentication.module");
const categories_module_1 = require("./categories/categories.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                validationSchema: Joi.object({
                    MONGO_USERNAME: Joi.string().required(),
                    MONGO_PASSWORD: Joi.string().required(),
                    MONGO_DATABASE: Joi.string().required(),
                    MONGO_HOST: Joi.string().required(),
                }),
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    return {
                        uri: `mongodb://127.0.0.1:27017/`,
                        dbName: 'admin',
                    };
                },
                inject: [config_1.ConfigService],
            }),
            flights_module_1.default,
            authentication_module_1.AuthenticationModule,
            categories_module_1.default,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map