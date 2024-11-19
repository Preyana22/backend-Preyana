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
        try {
            const bookingDetails = {
                name: createBookingDto.name,
                email: createBookingDto.email,
                loginEmail: createBookingDto.loginEmail,
                booking_id: createBookingDto.booking_id,
                booking_reference: createBookingDto.booking_reference,
                offer_id: createBookingDto.offer_id,
                status: createBookingDto.status,
                address1: createBookingDto.address1,
                address2: createBookingDto.address2,
                city: createBookingDto.city,
                region: createBookingDto.region,
                postal: createBookingDto.postal,
                country: createBookingDto.country,
                airlines: createBookingDto.airlines,
                slices: [],
            };
            const slices = createBookingDto.slices || [];
            slices.forEach((slice) => {
                bookingDetails.slices.push({
                    travelDate: slice.travelDate,
                    departTime: slice.departTime,
                    arrivalTime: slice.arrivalTime,
                    flightDuration: slice.flightDuration,
                    stops: slice.stops,
                    departAirport: slice.departAirport,
                    arrivalAirport: slice.arrivalAirport,
                    departCityName: slice.departCityName,
                    arrivalCityName: slice.arrivalCityName,
                });
            });
            try {
                const createdBooking = new this.bookingModel(bookingDetails);
                console.log("createdBooking", createdBooking);
                await createdBooking
                    .populate({
                    path: "bookings",
                    populate: {
                        path: "email",
                    },
                })
                    .execPopulate();
                return await createdBooking.save();
            }
            catch (error) {
                console.error("Error while saving booking:", error);
                throw new Error("Failed to save booking details. Please try again.");
            }
        }
        catch (error) {
            console.error("Error creating booking:", error);
            if (error.name === "ValidationError") {
                throw new Error("Invalid booking data. Please check the input.");
            }
            else if (error.name === "MongoError" && error.code === 11000) {
                throw new Error("Duplicate booking detected. A record with similar details already exists.");
            }
            else {
                throw new Error("An error occurred while creating the booking. Please try again later.");
            }
        }
    }
    async findAll(email, keyword, upcoming) {
        try {
            console.log("Filtering by email:", email);
            const filter = {
                $or: [
                    { email: { $regex: `^${email}$`, $options: "i" } },
                    { loginEmail: { $regex: `^${email}$`, $options: "i" } },
                ],
            };
            if (keyword) {
                console.log("Keyword provided:", keyword);
                filter.$and = [
                    ...(filter.$and || []),
                    {
                        $or: [
                            { booking_reference: { $regex: keyword, $options: "i" } },
                            { name: { $regex: keyword, $options: "i" } },
                            { airlines: { $regex: keyword, $options: "i" } },
                            {
                                slices: {
                                    $elemMatch: {
                                        arrivalAirport: { $regex: keyword, $options: "i" },
                                    },
                                },
                            },
                            {
                                slices: {
                                    $elemMatch: {
                                        departAirport: { $regex: keyword, $options: "i" },
                                    },
                                },
                            },
                            {
                                slices: {
                                    $elemMatch: {
                                        departCityName: { $regex: keyword, $options: "i" },
                                    },
                                },
                            },
                            {
                                slices: {
                                    $elemMatch: {
                                        arrivalCityName: { $regex: keyword, $options: "i" },
                                    },
                                },
                            },
                        ],
                    },
                ];
            }
            if (upcoming !== undefined) {
                const currentDate = new Date();
                const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
                filter["slices"] = {
                    $elemMatch: {
                        travelDate: upcoming
                            ? { $gte: startOfToday }
                            : { $lt: startOfToday },
                    },
                };
            }
            const sortCriteria = upcoming
                ? { "slices.travelDate": -1 }
                : { "slices.travelDate": -1 };
            return await this.bookingModel.find(filter).sort(sortCriteria).exec();
        }
        catch (error) {
            console.error("Error in findAll service method:", error.message);
            throw new common_1.InternalServerErrorException("Error retrieving bookings");
        }
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