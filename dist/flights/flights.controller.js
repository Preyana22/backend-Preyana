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
const flights_service_1 = require("./flights.service");
const mongooseClassSerializer_interceptor_1 = require("../utils/mongooseClassSerializer.interceptor");
const flights_schema_1 = require("./flights.schema");
const paginationParams_1 = require("../utils/paginationParams");
const api_1 = require("@duffel/api");
let PostsController = class PostsController {
    constructor(PostsService) {
        this.PostsService = PostsService;
    }
    async getFlight() {
        let Result = [];
        const duffelHeaders = {
            "Duffel-Version": "v1",
            Authorization: 'Bearer duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD',
        };
        const getAirports = await fetch("https://api.duffel.com/air/airports", {
            method: "GET",
            headers: duffelHeaders
        });
        return getAirports.text();
    }
    async getAllPosts({ skip, limit, startId }, searchQuery) {
    }
    async airliness(req) {
        let Adults = [];
        let adultsData = {
            "type": "adult"
        };
        for (var i = 0; i <= req.numOfPassengers.adult; i++) {
            Adults.push(adultsData);
        }
        const duffel = new api_1.Duffel({
            token: "duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD",
        });
        let econamy = 'econamy';
        if (req.returnDate === undefined) {
            var slices = [{
                    "origin": req.origin,
                    "destination": req.destination,
                    "departure_date": req.departureDate,
                }];
        }
        else {
            var slices = [{
                    "origin": req.origin,
                    "destination": req.destination,
                    "departure_date": req.departureDate,
                },
                {
                    "origin": req.destination,
                    "destination": req.origin,
                    "departure_date": req.returnDate,
                }];
        }
        const offerRequest = await duffel.offerRequests.create({
            "slices": slices,
            "passengers": req.numOfPassengers,
            "cabin_class": req.cabin_class,
        });
        let offerResult = [];
        let offers_clientkey;
        offers_clientkey = offerRequest.data;
        let test = offers_clientkey === null || offers_clientkey === void 0 ? void 0 : offers_clientkey.client_key;
        let client_key = 'client_key';
        offerResult.push(test);
        offerResult.push(offerRequest.data.offers);
        return JSON.stringify(offerResult);
    }
    async booking(request) {
        const duffel = new api_1.Duffel({
            token: "duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD",
        });
        const duffelHeaders = {
            "Duffel-Version": "v1",
            "Accept-Encoding": "gzip",
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: 'Bearer duffel_test_yCD3_H1fhAlpyuCarmZSIdUFaUwFAIUN4wKBksSS0DD',
        };
        const createOrderOnDuffelResponse = await fetch("https://api.duffel.com/air/orders", {
            method: "POST",
            headers: duffelHeaders,
            body: JSON.stringify(request),
        });
        return createOrderOnDuffelResponse.text();
    }
};
__decorate([
    common_1.Get('airports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getFlight", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query()),
    __param(1, common_1.Query('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginationParams_1.PaginationParams, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getAllPosts", null);
__decorate([
    common_1.Post('test'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "airliness", null);
__decorate([
    common_1.Post('book'),
    __param(0, common_1.Body()),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "booking", null);
PostsController = __decorate([
    common_1.Controller('airlines'),
    common_1.UseInterceptors(mongooseClassSerializer_interceptor_1.default(flights_schema_1.Post)),
    __metadata("design:paramtypes", [flights_service_1.default])
], PostsController);
exports.default = PostsController;
//# sourceMappingURL=flights.controller.js.map