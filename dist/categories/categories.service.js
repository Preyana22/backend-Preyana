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
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const category_schema_1 = require("./category.schema");
const common_2 = require("@nestjs/common");
let CategoriesService = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async findAll() {
        return this.categoryModel.find().populate('author');
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).populate('author');
        if (!category) {
            throw new common_2.NotFoundException();
        }
        return category;
    }
    create(categoryData, author) {
        const createdCategory = new this.categoryModel(Object.assign(Object.assign({}, categoryData), { author }));
        return createdCategory.save();
    }
    async update(id, categoryData) {
        const category = await this.categoryModel
            .findByIdAndUpdate(id, categoryData)
            .setOptions({ overwrite: true, new: true });
        if (!category) {
            throw new common_2.NotFoundException();
        }
        return category;
    }
    async delete(categoryId) {
        const result = await this.categoryModel.findByIdAndDelete(categoryId);
        if (!result) {
            throw new common_2.NotFoundException();
        }
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CategoriesService);
exports.default = CategoriesService;
//# sourceMappingURL=categories.service.js.map