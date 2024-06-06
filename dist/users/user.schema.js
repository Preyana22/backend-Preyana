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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const address_schema_1 = require("./address.schema");
const flights_schema_1 = require("../flights/flights.schema");
let User = class User {
};
__decorate([
    class_transformer_1.Transform(({ value }) => value.toString()),
    __metadata("design:type", Object)
], User.prototype, "_id", void 0);
__decorate([
    mongoose_1.Prop({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    mongoose_1.Prop(),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    mongoose_1.Prop({ type: address_schema_1.AddressSchema }),
    class_transformer_1.Type(() => address_schema_1.Address),
    __metadata("design:type", address_schema_1.Address)
], User.prototype, "address", void 0);
__decorate([
    mongoose_1.Prop({
        get: (creditCardNumber) => {
            if (!creditCardNumber) {
                return;
            }
            const lastFourDigits = creditCardNumber.slice(creditCardNumber.length - 4);
            return `****-****-****-${lastFourDigits}`;
        },
    }),
    __metadata("design:type", String)
], User.prototype, "creditCardNumber", void 0);
__decorate([
    class_transformer_1.Type(() => flights_schema_1.Post),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
User = __decorate([
    mongoose_1.Schema({
        toJSON: {
            getters: true,
            virtuals: true,
        },
    })
], User);
exports.User = User;
const UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema = UserSchema;
UserSchema.index({ userName: 'text' });
UserSchema.virtual('fullName').get(function () {
    return `${this.userName}`;
});
UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
});
//# sourceMappingURL=user.schema.js.map