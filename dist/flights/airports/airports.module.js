"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirportsModule = void 0;
const common_1 = require("@nestjs/common");
const airports_service_1 = require("./airports.service");
const airports_controller_1 = require("./airports.controller");
const airports_schema_1 = require("./schemas/airports.schema");
const mongoose_1 = require("@nestjs/mongoose");
let AirportsModule = class AirportsModule {
};
AirportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: airports_schema_1.Airport.name, schema: airports_schema_1.AirportSchema }]),
        ],
        providers: [airports_service_1.AirportsService],
        controllers: [airports_controller_1.AirportsController],
    })
], AirportsModule);
exports.AirportsModule = AirportsModule;
//# sourceMappingURL=airports.module.js.map