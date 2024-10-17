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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
const mongodb_1 = require("mongodb");
let BookingService = class BookingService {
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
    }
    async create(createBookingDto) {
        const createdBooking = new this.bookingModel(createBookingDto);
        await createdBooking
            .populate({
            path: "bookings",
            populate: {
                path: "email",
            },
        })
            .execPopulate();
        return createdBooking.save();
    }
    async findAll(value) {
        console.log("Filtering by value:", value);
        return this.bookingModel
            .find({
            $or: [
                { email: { $regex: value, $options: "i" } },
                { loginEmail: { $regex: value, $options: "i" } },
            ],
        })
            .exec();
    }
    async findById(id) {
        return this.bookingModel.findById(id).exec();
    }
    async update(id, updateBookingDto) {
        return this.bookingModel
            .findByIdAndUpdate(id, updateBookingDto, { new: true })
            .exec();
    }
    async updateStatus(id, bookingId, status) {
        try {
            const objectId = new mongodb_1.ObjectId(id);
            console.log("objectId" + objectId);
            console.log("userId" + bookingId);
            const booking = await this.bookingModel.findOne({
                _id: objectId,
                booking_id: bookingId,
            });
            if (!booking) {
                return null;
            }
            booking.status = status;
            return await booking.save();
        }
        catch (error) {
            console.error("Error in updateStatus:", error);
            throw new Error("Failed to update booking status.");
        }
    }
    async delete(id) {
        return this.bookingModel.findByIdAndRemove(id).exec();
    }
};
BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map