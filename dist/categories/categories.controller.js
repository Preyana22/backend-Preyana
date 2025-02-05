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
const categories_service_1 = require("./categories.service");
const paramsWithId_1 = require("../utils/paramsWithId");
const category_dto_1 = require("./dto/category.dto");
const jwt_authentication_guard_1 = require("../authentication/jwt-authentication.guard");
const mongooseClassSerializer_interceptor_1 = require("../utils/mongooseClassSerializer.interceptor");
const category_schema_1 = require("./category.schema");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async getAllCategories() {
        return this.categoriesService.findAll();
    }
    async getCategory({ id }) {
        return this.categoriesService.findOne(id);
    }
    async createCategory(category, req) {
        return this.categoriesService.create(category, req.user);
    }
    async deleteCategory({ id }) {
        return this.categoriesService.delete(id);
    }
    async updateCategory({ id }, category) {
        return this.categoriesService.update(id, category);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramsWithId_1.default]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_authentication_guard_1.default),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramsWithId_1.default]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramsWithId_1.default,
        category_dto_1.default]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    (0, common_1.UseInterceptors)((0, mongooseClassSerializer_interceptor_1.default)(category_schema_1.Category)),
    __metadata("design:paramtypes", [categories_service_1.default])
], CategoriesController);
exports.default = CategoriesController;
//# sourceMappingURL=categories.controller.js.map